# Shell Necklace
[HDU5730]

Perhaps the sea‘s definition of a shell is the pearl. However, in my view, a shell necklace with n beautiful shells contains the most sincere feeling for my best lover Arrietty, but even that is not enough.  
Suppose the shell necklace is a sequence of shells (not a chain end to end). Considering i continuous shells in the shell necklace, I know that there exist different schemes to decorate the i shells together with one declaration of love.  
I want to decorate all the shells with some declarations of love and decorate each shell just one time. As a problem, I want to know the total number of schemes. 

给出 [1,n]  n 种长度的长条，每种长度有 $A_i$ 种规格，每种规格有无限个，求拼出 n 的方案数。

设 f(i) 表示长度为 i 时的答案，那么有背包 $f(i)=\sum _ {j=1}^i A _ j f(i-j)$ ，这是一个卷积的形式，直接分治 FFT 或者化成生成函数求逆来做。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
using namespace std;

#define ll long long
#define ld long double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000*8;
const ld Pi=acos(-1);
const int Mod=313;
const int inf=2147483647;

class Complex
{
public:
	ld x,y;
	Complex(){}
	Complex(ld a,ld b){
		x=a;y=b;return;
	}
};

ll n,A[maxN],Rader[maxN];
ll B1[maxN],B2[maxN];
Complex I1[maxN],I2[maxN],Wn[maxN],Iwn[maxN];

Complex operator + (Complex A,Complex B);
Complex operator - (Complex A,Complex B);
Complex operator * (Complex A,Complex B);
ll QPow(ll x,ll cnt);
void FFT(Complex *P,int N,int opt);
void PolyInv(ll *A,ll *B,int len);

int main(){
	while ((scanf("%lld",&n)!=EOF)&&(n)){
		for (int i=1;i<=n;i++) scanf("%lld",&A[i]);
		for (int i=1;i<=n;i++) B1[i]=(Mod-A[i]%Mod);
		B1[0]=1;int N=1;while (N<=n) N<<=1;
		PolyInv(B1,B2,N);
		printf("%lld\n",B2[n]);
		mem(B1,0);mem(B2,0);
	}
	return 0;
}

Complex operator + (Complex A,Complex B){
	return (Complex){A.x+B.x,A.y+B.y};
}

Complex operator - (Complex A,Complex B){
	return (Complex){A.x-B.x,A.y-B.y};
}

Complex operator * (Complex A,Complex B){
	return (Complex){A.x*B.x-A.y*B.y,A.x*B.y+A.y*B.x};
}

ll QPow(ll x,ll cnt){
	ll ret=1;
	while (cnt){
		if (cnt&1) ret=1ll*ret*x%Mod;
		x=1ll*x*x%Mod;cnt>>=1;
	}
	return ret;
}

void FFT(Complex *P,int N,int opt){
	int L=0,l;for (l=1;l<N;l<<=1) ++L;for (int i=0;i<N;i++) Rader[i]=(Rader[i>>1]>>1)|((i&1)<<(L-1));
	for (int i=0;i<N;i++) if (i<Rader[i]) swap(P[i],P[Rader[i]]);
	for (int i=1;i<N;i<<=1)
		for (int j=0;j<N;j+=(i<<1))
			for (int k=0;k<i;k++){
				Complex X=P[j+k],Y=P[j+k+i]*((opt==1)?(Wn[N/(i<<1)*k]):(Iwn[N/(i<<1)*k]));
				P[j+k]=X+Y;P[j+k+i]=X-Y;
			}
	if (opt==-1) for (int i=0;i<N;i++) P[i].x=(P[i].x/N+0.5);
	return;
}
void PolyInv(ll *A,ll *B,int len){
	if (len==1){
		B[0]=QPow(A[0],Mod-2);return;
	}
	PolyInv(A,B,len>>1);
	for (int i=0;i<len;i++) I1[i].x=A[i],I2[i].x=B[i];
	for (int i=0;i<len<<1;i++){
		Wn[i]=((Complex){cos((ld)Pi*(ld)i/(ld)len),sin((ld)Pi*(ld)i/(ld)len)});
		Iwn[i]=Wn[i];Iwn[i].y=-Iwn[i].y;
	}
	FFT(I1,len<<1,1);FFT(I2,len<<1,1);
	for (int i=0;i<len<<1;i++) I2[i]=I2[i]*I2[i];
	FFT(I2,len<<1,-1);for (int i=0;i<len<<1;i++) I2[i].x=(ll)(I2[i].x)%Mod;FFT(I2,len<<1,1);
	for (int i=0;i<len<<1;i++) I1[i]=I1[i]*I2[i];
	FFT(I1,len<<1,-1);
	for (int i=0;i<len;i++) B[i]=(2ll*B[i]%Mod-(ll)I1[i].x%Mod+Mod)%Mod;
	for (int i=0;i<len<<1;i++) I1[i]=I2[i]=((Complex){0,0});
	return;
}
```