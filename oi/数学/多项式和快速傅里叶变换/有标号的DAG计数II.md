# 有标号的DAG计数II
[CJOJ2467]

给定一正整数n，对n个点有标号的有向无环图(可以不连通)进行计数，输出答案mod 998244353的结果

设 f(n) 表示有 n 个点的有向无环图数量，考虑枚举入度为 0 的点的数量，强制让它们成为入度为 0 的点，然后与剩下的若干点组成的 DAG 随意连边。注意到与剩下的随意连边不能保证剩下的点中不存在入度为 0 的点，所以求出来的实际是至少有这么多个入度为 0 的点的方案数，容斥一下。

$$
\begin{align}
f(n)&=\sum _ {i=1}^n (-1)^{i-1} \binom{n}{i}f(n-i)2^{i(n-i)} \\\\
f(n)&=\sum _ {i=1}^n (-1)^{i-1} \frac{n!}{(n-i)!i!}2^{i(n-i)}
\end{align}
$$

注意到直接拆开 i(n-i) 无法得到易化简的生成函数形式，由 $i(n-i)=\frac{1}{2}(n^2-i^2-(n-i)^2)$ ，令 t 为 2 在本题模数 998244353 下的二次剩余，得到

$$
\begin{align}
f(n)&=\sum _ {i=1}^n(-1)^{i-1} \frac{n!}{(n-i)!i!} \frac{t^{n^2}}{t^{i^2}t^{(n-i)^2}}f(n-i) \\\\
\frac{f(n)}{n!t^{n^2}}&=\sum _ {i=1}^n\frac{f(n-i)}{(n-i)!t^{(n-i)^2}} \frac{(-1)^{i-1}}{i!t^{i^2}}
\end{align}
$$

设两个生成函数 F(x),G(x) ，则有 $F(x)=F(x)G(x)+f _ 0$ ，转化一下得到 $F(x)=\frac{1}{1-G(x)}$ ，多项式求逆。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

const int maxN=101000*10;
const int Mod=998244353;
const int G=3;
const int sqrt2=116195171;
const int inf=2147483647;

int n;
int Fac[maxN],Inv[maxN],Rader[maxN];
int A[maxN],IA[maxN],I1[maxN],I2[maxN];

int QPow(int x,int cnt);
void NTT(int *P,int len,int opt);
void PolyInv(int *A,int *B,int len);

int main(){
	Fac[0]=Inv[0]=1;for (int i=1;i<maxN;i++) Fac[i]=1ll*Fac[i-1]*i%Mod;
	Inv[maxN-1]=QPow(Fac[maxN-1],Mod-2);for (int i=maxN-2;i>=1;i--) Inv[i]=1ll*Inv[i+1]*(i+1)%Mod;
	scanf("%d",&n);
	for (int i=1;i<=n;i++) A[i]=(1ll*((i&1)?(-1):(1))*Inv[i]%Mod*QPow(QPow(sqrt2,1ll*i*i%(Mod-1)),Mod-2)%Mod+Mod)%Mod;
	A[0]=1;int N=1;while (N<=n) N<<=1;
	PolyInv(A,IA,N);
	printf("%lld\n",1ll*IA[n]*Fac[n]%Mod*QPow(sqrt2,1ll*n*n%(Mod-1))%Mod);
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

void NTT(int *P,int len,int opt){
	int L=0,l;for (l=1;l<len;l<<=1) ++L;for (int i=0;i<len;i++) Rader[i]=(Rader[i>>1]>>1)|((i&1)<<(L-1));
	for (int i=0;i<len;i++) if (i<Rader[i]) swap(P[i],P[Rader[i]]);
	for (int i=1;i<len;i<<=1){
		int dw=QPow(G,(Mod-1)/(i<<1));if (opt==-1) dw=QPow(dw,Mod-2);
		for (int j=0;j<len;j+=(i<<1))
			for (int k=0,w=1;k<i;k++,w=1ll*w*dw%Mod){
				int X=P[j+k],Y=1ll*P[j+k+i]*w%Mod;
				P[j+k]=(X+Y)%Mod;P[j+k+i]=(X-Y+Mod)%Mod;
			}
	}
	if (opt==-1){
		int inv=QPow(len,Mod-2);
		for (int i=0;i<len;i++) P[i]=1ll*P[i]*inv%Mod;
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