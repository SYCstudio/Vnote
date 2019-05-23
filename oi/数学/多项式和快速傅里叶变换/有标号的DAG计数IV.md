# 有标号的DAG计数IV
[CJOJ2469]

给定一正整数n，对n个点有标号的有向无环图进行计数，这里加一个限制：此图必须是弱连通图。输出答案mod 998244353的结果。

考虑用总方案减去不合法。设 f(n) 表示 n 个点有标号有向无环图的数量， g(n) 表示在 f(n) 基础上还要求弱连通的数量，f(n) 可由上一问得到，则枚举弱连通的部分

$$
\begin{align}
g(n)=f(n)-\sum_{i=1}^{n-1}\binom{n-1}{i}f(n-i)g(i) \nonumber
\end{align}
$$

展开组合数后直接生成函数，解方程然后多项式求逆+卷积。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000*10;
const int Mod=998244353;
const int G=3;
const int sqrt2=116195171;
const int inf=2147483647;

int n;
int Fac[maxN],Inv[maxN],Rader[maxN];
int A[maxN],B[maxN],C[maxN],I1[maxN],I2[maxN];

int QPow(int x,int cnt);
void NTT(int *P,int N,int opt);
void PolyInv(int *A,int *B,int len);

int main(){
	Fac[0]=Inv[0]=1;for (int i=1;i<maxN;i++) Fac[i]=1ll*Fac[i-1]*i%Mod;
	Inv[maxN-1]=QPow(Fac[maxN-1],Mod-2);for (int i=maxN-2;i>=1;i--) Inv[i]=1ll*Inv[i+1]*(i+1)%Mod;
	scanf("%d",&n);
	for (int i=1;i<=n;i++) A[i]=(1ll*((i&1)?(-1):(1))*Inv[i]%Mod*QPow(QPow(sqrt2,1ll*i*i%(Mod-1)),Mod-2)%Mod+Mod)%Mod;
	int N=1;while (N<=n) N<<=1;
	A[0]=1;PolyInv(A,B,N);
	for (int i=n+1;i<N;i++) B[i]=0;
	B[0]=0;for (int i=1;i<=n;i++) B[i]=1ll*B[i]*Fac[i]%Mod*QPow(sqrt2,1ll*i*i%(Mod-1))%Mod;
	
	mem(A,0);for (int i=0;i<=n;i++) A[i]=B[i];
	
	mem(B,0);for (int i=1;i<=n;i++) C[i]=1ll*A[i]*Inv[i]%Mod;
	C[0]=1;PolyInv(C,B,N);
	
	mem(C,0);for (int i=1;i<=n;i++) C[i]=1ll*A[i]*Inv[i-1]%Mod;
	NTT(B,N<<1,1);NTT(C,N<<1,1);
	for (int i=0;i<N<<1;i++) B[i]=1ll*B[i]*C[i]%Mod;
	NTT(B,N<<1,-1);
	printf("%lld\n",1ll*B[n]*Fac[n-1]%Mod);
	return 0;
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
	int l,L=0;for (l=1;l<N;l<<=1) ++L;for (int i=0;i<N;i++) Rader[i]=(Rader[i>>1]>>1)|((i&1)<<(L-1));
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

void PolyInv(int *A,int *B,int len){
	if (len==1){
		B[0]=QPow(A[0],Mod-2);return;
	}
	PolyInv(A,B,len>>1);
	for (int i=0;i<len;i++) I1[i]=A[i],I2[i]=B[i];
	NTT(I1,len<<1,1);NTT(I2,len<<1,1);
	for (int i=0;i<len<<1;i++) I1[i]=1ll*I1[i]*I2[i]%Mod*I2[i]%Mod;
	NTT(I1,len<<1,-1);
	for (int i=0;i<len;i++) B[i]=(2ll*B[i]%Mod-I1[i]+Mod)%Mod;
	for (int i=0;i<len<<1;i++) I1[i]=I2[i]=0;
	return;
}
```