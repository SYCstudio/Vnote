# 有标号的DAG计数
[CJOJ2467 CJOJ2469]

求 n 个点有标号的弱连通 DAG 数量。

先求 n 个点的 DAG 数量。设 f(n) 为 n 个点的 DAG 数量，枚举入度为 0 的点，把它们与剩下的点形成的 DAG 随意连边， $f(n)=\sum _ {i=1}^n(-1)^{i-1}\binom{n}{i}f(n-i)2^{i(n-i)}$ ，要容斥的原因是连边的时候不能保证剩下的点中不会出现入度为０的点，所以实际上算出来的是至少 i 个点入度为 0 的方案，所以要容斥掉。  
设 $t\equiv \sqrt{2} \pmod{M}$ ，同时有 $2i(n-i)=n^2-i^2-(n-i)^2$带入有 $f(n)=\sum  _ {i=1}^n(-1)^{i-1}\frac{n!}{(n-i)!i!}f(n-i)\frac{t^{n^2}}{t^{i^2}t^{(n-i)^2}}$ ，移项得到 $\frac{f(n)}{n!t^{n^2}}=\sum_{i=1}^n\frac{(-1)^{i-1}}{i!t^{i^2}}\frac{f(n-i)}{(n-i)!t^{(n-i)^2}}$ ，设 $A(x),B(x)$ 分别为 $\frac{f(n)}{n!t^{n^2}},\frac{(-1)^{i-1}}{i!t^{i^2}}$ 的生成函数，则有 $A(x)=B(x)A(x)+1$ ，要加一的原因是直接卷积时没有考虑 $f _ 0$ ，所以要加上。那么有 $A(x)=\frac{1}{1-B(x)}$ ，多项式求逆。

然后考虑求弱连通的。正难则反，设 g(i) 表示弱连通的 DAG 数量，考虑枚举与 1 在同一个弱连通分量的点集，则有$g(n)=f(n)-\sum _ {i=1}^{n-1}\binom{n-1}{i-1}g(i)f(n-i)$ 保证前后一定不形成弱连通，那么同样展开组合数，$g(n)=f(n)-\sum _ {i=1}^n \frac{(n-1)!}{(i-1)!(n-i)!}g(i)f(n-i),\frac{g(n)}{(n-1)!}=\frac{f(n)}{(n-1)!}-\sum _ {i=1}^n \frac{g(i)}{(i-1)!}\frac{f(n-i)}{(n-i)!}$ ，同样转成生成函数然后求逆。

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