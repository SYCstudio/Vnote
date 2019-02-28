# Perpetual Subtraction
[CF923E]

There is a number x initially written on a blackboard. You repeat the following action a fixed amount of times:  
take the number x currently written on a blackboard and erase it  
select an integer uniformly at random from the range [0, x] inclusive, and write it on the blackboard  
Determine the distribution of final number given the distribution of initial number and the number of steps.

设 F[i][j] 表示到第 i 轮为 j 的概率，不难列出转移方程 $F[i][j]=\sum _ {k=j}^n \frac{F[i-1][k]}{k+1}$ 。  
写成生成函数的形式，设 f,f' 为系数 F(x),F'(x) 为对应的生成函数，有：

$$
\begin{align}
F'(x)&=\sum _ {i=1} ^ n x ^ i \sum _ {j=i} ^ n \frac{f _ j}{j+1} \nonumber\\\\
&=\sum _ {i=0} ^ n \frac{f _ i}{i+1} \sum _ {j=0} ^ i x ^ j \nonumber \\\\
&=\sum _ {i=0} ^ n \frac{f _ i}{i+1} \frac{x ^ {i+1}-1}{x-1} \nonumber \\\\
&=\frac{1}{x-1} \sum _ {i=0} ^ n \frac{f _ i (x ^ {i+1}-1)}{i+1} \nonumber \\\\
&=\frac{1}{x-1} \sum _ {i=0} ^ n \int _ 1 ^x f _ i t ^ i dt\nonumber
\end{align}
$$

式子化到这里，似乎不好突破了。考虑用 G(x)=F(x+1) 和 G'(x)=F'(x+1) 代替，将积分下限换成 0 ，同理定义 g,g'

$$
\begin{align}
G'(x)&=\frac{1}{x} \sum _ {i=0} ^ n \int _ 1 ^ {x+1} f _ i t ^ i dt \nonumber \\\\
&=\frac{1}{x} \sum _ {i=0} ^ n \int _ 0 ^ x g _ i t ^ i dt \nonumber \\\\
&=\frac{1}{x} \sum _ {i=0} ^ n \frac{g _ ix ^ {i+1}}{i+1} \nonumber \\\\
&=\sum _ {i=0} ^ n \frac{g _ i x ^ i}{i+1}\nonumber
\end{align}
$$

也就是说，每一次递推相当于给 g 的第 i 项除以 i+1 ，这个快速幂。  
最后考虑 F 与 G 的转化。由于有 G(x)=F(x+1) ，二项式定理展开可以观察到是一个卷积的形式；反过来则是二项式反演。

```cpp
#include<cstdio>
#include<cstring>
#include<cstdlib>
#include<algorithm>
#include<iostream>
using namespace std;

typedef long long ll;
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
const int maxN=101000*8;
const int G=3;
const int Mod=998244353;

int n;
ll m;
int Fc[maxN],Ifc[maxN];
int In[maxN],A[maxN],B[maxN],C[maxN],R[maxN];

int QPow(int x,int cnt);
void NTT(int *P,int N,int opt);

int main(){
    Fc[0]=Ifc[0]=1;for (int i=1;i<maxN;i++) Fc[i]=1ll*Fc[i-1]*i%Mod;
    Ifc[maxN-1]=QPow(Fc[maxN-1],Mod-2);for (int i=maxN-2;i>=1;i--) Ifc[i]=1ll*Ifc[i+1]*(i+1)%Mod;

    scanf("%d%lld",&n,&m);int N=1;while (N<=n+n) N<<=1;m=m%(Mod-1);
    for (int i=0;i<=n;i++) scanf("%d",&In[i]),B[i]=1ll*Fc[i]*In[i]%Mod;
    for (int i=0;i<=n;i++) C[i]=Ifc[n-i];

    NTT(B,N,1);NTT(C,N,1);for (int i=0;i<N;i++) B[i]=1ll*B[i]*C[i]%Mod;NTT(B,N,-1);

    for (int i=0;i<=n;i++) A[i]=1ll*B[i+n]*Ifc[i]%Mod;
    for (int i=0;i<=n;i++) A[i]=1ll*A[i]*QPow(QPow(i+1,Mod-2),m)%Mod*Fc[i]%Mod;
    mem(C,0);
    for (int i=0;i<=n;i++) C[i]=(i&1)?Mod-Ifc[i]:Ifc[i];
    reverse(&C[0],&C[n+1]);
    NTT(A,N,1);NTT(C,N,1);for (int i=0;i<N;i++) A[i]=1ll*A[i]*C[i]%Mod;NTT(A,N,-1);
    for (int i=0;i<=n;i++) printf("%lld ",1ll*A[i+n]*Ifc[i]%Mod);printf("\n");
    return 0;
}
int QPow(int x,int cnt){
    int ret=1;
    while (cnt){
        if (cnt&1) ret=1ll*ret*x%Mod;
        cnt>>=1;x=1ll*x*x%Mod;
    }
    return ret;
}
void NTT(int *P,int N,int opt){
    int l=-1,_n=N;while (_n) ++l,_n>>=1;
    for (int i=0;i<N;i++) R[i]=(R[i>>1]>>1)|((i&1)<<(l-1));
    for (int i=0;i<N;i++) if (i<R[i]) swap(P[i],P[R[i]]);
    for (int i=1;i<N;i<<=1){
        int dw=QPow(G,(Mod-1)/(i<<1));
        if (opt==-1) dw=QPow(dw,Mod-2);
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