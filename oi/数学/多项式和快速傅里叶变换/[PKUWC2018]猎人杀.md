# [PKUWC2018]猎人杀
[LOJ2541]

猎人杀是一款风靡一时的游戏“狼人杀”的民间版本，他的规则是这样的：  
一开始有 $n$ 个猎人，第 $i$ 个猎人有仇恨度 $w _ i$ ，每个猎人只有一个固定的技能：死亡后必须开一枪，且被射中的人也会死亡。  
然而向谁开枪也是有讲究的，假设当前还活着的猎人有 $[i _ 1\ldots i _ m]$，那么有 $\frac{w _ {i _ k}}{\sum\limits _ {j = 1}^{m} w _ {i _ j}}$ 的概率是向猎人 $i _ k$ 开枪。  
一开始第一枪由你打响，目标的选择方法和猎人一样（即有 $\frac{w _ i}{\sum\limits _ {j=1}^{n}w _ j}$ 的概率射中第 $i$ 个猎人）。由于开枪导致的连锁反应，所有猎人最终都会死亡，现在 $1$ 号猎人想知道它是最后一个死的的概率。  
答案对 $998244353$ 取模。

首先考虑已经死去的猎人如何处理。每次有猎人死去后，概率的分母会发生变化，这个很不好处理。考虑换一种方式，假设所有猎人都依然贡献分母，但是如果随机到了已经死去的猎人就继续选择，直到随机到一个仍然活着的猎人。这样依然是正确的，证明如下。  
设全体猎人的 $w _ i$ 之和为 S ，已经死去的猎人概率之和为 A ，对于一个仍然活着的猎人 $w _ i$ ，他在本轮被干掉的概率是 $\frac{w _ i}{S-A}$，根据我们上面的猜想，如果打到一个已死的猎人就继续打，这个式子列出来是 $\sum _ {i=0} ^ {\infty} w _ i \frac{A^i}{S^{i+1}}$ ，等比数列求和后发现两个式子是等价的。  
问题仍然不好直接处理，考虑容斥。强制一个集合 $T$ 中的猎人在一号猎人之后死亡，设 $A=\sum _ {i \in T} w _ i $那么枚举一号猎人死亡的时间，有 $(-1)^{|T|}\sum _ {i=0} ^ {\infty} \frac{w _ 1}{S}(1-\frac{A+w _ 1}{S})=(-1)^ {T}\frac{w _ 1}{A+w _ 1}$。  
那么暴力的做法就是枚举所有的可行集合计算答案。  
注意到那个 $-1$ 是可以移到里面，即只与 A 有关，而每一个 $w _ i$ 会贡献一个 (-1) ，同时又注意到数据范围保证 $\sum w _ i \le 10 ^ 5$ ，这是一个类似背包的转移，对于每一个 $w _ i$ 构造生成函数 $1-x ^ {w _ i}$ ，这样卷起来 $x ^ S$ 的系数就是所求式中和为 $S$ 的所有集合的容斥系数之和。分治 +NTT 即可。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000*4;
const int Mod=998244353;
const int G=3;
const int maxBit=20;

int n;
int W[maxN];
int F[maxBit][maxN],Rader[maxN];

int QPow(int x,int cnt);
void NTT(int *P,int N,int opt);
int Divide(int d,int l,int r);

int main(){
    scanf("%d",&n);
    for (int i=1;i<=n;i++) scanf("%d",&W[i]);
    int sum=0,Ans=0;for (int i=2;i<=n;i++) sum=(sum+W[i])%Mod;
    Divide(1,2,n);
    for (int i=0;i<=sum;i++) Ans=(Ans+1ll*W[1]%Mod*F[1][i]%Mod*QPow(i+W[1],Mod-2)%Mod)%Mod;
    printf("%d\n",Ans);return 0;
}
int QPow(int x,int cnt){
    int ret=1;
    while (cnt){
	if (cnt&1) ret=1ll*ret*x%Mod;
	x=1ll*x*x%Mod;cnt>>=1;
    }
    return ret;
}
void NTT(int *P,int N,int opt){
    int l=1,L=0;while (l<N) l<<=1,++L;
    for (int i=0;i<N;i++) Rader[i]=(Rader[i>>1]>>1)|((i&1)<<(L-1));
    for (int i=0;i<N;i++) if (i<Rader[i]) swap(P[i],P[Rader[i]]);
    for (int i=1;i<N;i<<=1){
	int dw=QPow(G,(Mod-1)/(i<<1));if (opt==-1) dw=QPow(dw,Mod-2);
	for (int j=0;j<N;j+=(i<<1))
	    for (int k=0,w=1;k<i;k++,w=1ll*w*dw%Mod){
		int X=P[j+k],Y=1ll*P[j+k+i]*w%Mod;
		P[j+k]=(X+Y)%Mod;P[j+k+i]=(X-Y+Mod)%Mod;
	    }
    }
    if (opt==-1){
	int inv=QPow(N,Mod-2);
	for (int i=0;i<N;i++) P[i]=1ll*P[i]*inv%Mod;
    }
    return;
}
int Divide(int d,int l,int r){
    if (l==r){
	F[d][0]=1;F[d][W[l]]=Mod-1;
	return W[l];
    }
    int lsz,rsz,mid=(l+r)>>1;
    lsz=Divide(d+1,l,mid);
    for (int i=0;i<=lsz;i++) F[d][i]=F[d+1][i],F[d+1][i]=0;
    rsz=Divide(d+1,mid+1,r);
    int N=1;while (N<=lsz+rsz+1) N<<=1;
    NTT(F[d],N,1);NTT(F[d+1],N,1);
    for (int i=0;i<N;i++) F[d][i]=1ll*F[d][i]*F[d+1][i]%Mod;
    NTT(F[d],N,-1);
    for (int i=lsz+rsz+1;i<N;i++) F[d][i]=0;
    for (int i=0;i<N;i++) F[d+1][i]=0;
    return lsz+rsz;
}
```