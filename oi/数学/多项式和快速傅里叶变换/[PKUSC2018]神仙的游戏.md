# [PKUSC2018]神仙的游戏
[BZOJ5372 LOJ6436]
小 $D$ 和小 $H$ 是两位神仙。他们经常在一起玩神仙才会玩的一些游戏，比如 “口算一个 4 位数是不是完全平方数” 。

今天他们发现了一种新的游戏：首先称 $s$ 长度为 $len$ 的前缀成为 border 当且仅当 $s[1\dots len ] = s[|s|-len + 1\dots |s|]$ 。给出一个由 01? 组成的字符串 $s$, 将 $s$ 中的问号用变成 01 替换，对每个 $len$ 口算是否存在替换问号的方案使得 $s$ 长度为$len$的前缀成为 border，把这个结果记做 $f(len)\in \{0,1\}$。$f(len) = 1$如果 $s$ 长度为$len$的前缀能够成为 border，否则$f(len) = 0$。

由于小 $D$ 和小 $H$ 是神仙，所以他们计算的 $s$ 的长度很长，因此把计算的结果一一比对会花费很长的时间。为了方便比对，他们规定了一个校验值：$(f(1)\times 1^2)~xor~(f(2)\times 2^2)~xor~(f(3)\times 3^2)~xor~\dots~xor~(f(n)\times n^2)$来校验他们的答案是否相同。xor 表示按位异或。但是不巧，在某一次游戏中，他们口算出的校验值并不一样，他们希望你帮助他们来计算一个正确的校验值。当然，他们不强迫你口算，可以编程解决。

直接的想法就是对两个串构造多项式然后卷积，但是由于这里是 border ，会有重叠的部分所以不能直接卷积。  
换一种思路，考虑 border 相同的另一种判断方式。对于长度为 k 的 border ，如果按照  len-k 剩余系分类，则分在同一类的字符必须相同。考虑一对在两个串中的 0,1 假设他们位置的差值为 d ，那么对于每一个 (len-k)|d ，都会使得这个 border 不合法。问题转化为求两个串中 0-1 组有多少种位置的插值，直接构造多项式卷积。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long

const int maxN=505000*4;
const int Mod=998244353;
const int G=3;
const int inf=2147483647;

int n,N,L;
char Input[maxN];
int A1[maxN],B1[maxN],A2[maxN],B2[maxN];
int Rader[maxN];
bool Mark[maxN];

int QPow(int x,int cnt);
void Mul(int *A,int *B);
void NTT(int *P,int opt);

int main(){
	scanf("%s",Input);n=strlen(Input);
	for (int i=0;i<n;i++)
		if (Input[i]=='0') B2[n-i-1]=1;
		else if (Input[i]=='1') A2[i]=1;
	N=1;L=0;while (N<n+n) ++L,N<<=1;
	for (int i=0;i<N;i++) Rader[i]=(Rader[i>>1]>>1)|((i&1)<<(L-1));
	
	Mul(A2,B2);

	for (int i=0;i<n-i-1;i++) swap(A2[i],A2[n-i-1]);
	ll Ans=1ll*n*n;
	for (int i=1;i<n;i++){
		bool flag=1;
		for (int j=n-i;j<=n;j=j+n-i) if ((A2[n+j-1])||(A2[j])) {flag=0;break;}
		if (flag) Ans^=1ll*i*i;
	}
	printf("%lld\n",Ans);return 0;
}

int QPow(int x,int cnt){
	int ret=1;
	while (cnt){
		if (cnt&1) ret=1ll*ret*x%Mod;
		x=1ll*x*x%Mod;cnt>>=1;
	}
	return ret;
}

void Mul(int *A,int *B){
	NTT(A,1);NTT(B,1);
	for (int i=0;i<N;i++) A[i]=1ll*A[i]*B[i]%Mod;
	NTT(A,-1);return;
}

void NTT(int *P,int opt){
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
```