# Triple Sums
[SPOJ TSUM]

You're given a sequence s of N distinct integers.  
Consider all the possible sums of three integers from the sequence at three different indicies.  
For each obtainable sum output the number of different triples of indicies that generate it.

给出若干数，求每一个$K=A[i]+A[j]+A[k] \ (i<j<k)$的方案数

$FFT$卷积然后去重。

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

const int maxN=40000*5;
const int Delta=20000;
const ld Pi=acos(-1);
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

int n;
int Num[maxN],Rader[maxN];
Complex P1[maxN],P2[maxN],Wn[maxN];

Complex operator + (Complex A,Complex B);
Complex operator - (Complex A,Complex B);
Complex operator * (Complex A,Complex B);
void FFT(Complex *P,int N,int opt);

int main()
{
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&Num[i]),Num[i]=Num[i]+Delta;
	sort(&Num[1],&Num[n+1]);
	for (int i=1;i<=n;i++) P1[Num[i]].x+=1.0,P2[Num[i]+Num[i]].x+=1.0;

	int N,L=0;
	for (N=1;N<=Num[n]*3;N<<=1) L++;
	for (int i=1;i<N;i++) Rader[i]=(Rader[i>>1]>>1)|((i&1)<<(L-1));
	for (int i=0;i<N;i++) Wn[i]=Complex(cos(2*Pi*i/N),sin(2*Pi*i/N));

	FFT(P1,N,1);FFT(P2,N,1);
	for (int i=0;i<N;i++) P2[i]=P2[i]*P1[i],P1[i]=P1[i]*P1[i]*P1[i];
	FFT(P1,N,-1);FFT(P2,N,-1);

	for (int i=1;i<=n;i++) P2[Num[i]*3].x-=1.0,P1[Num[i]*3].x-=1.0;
	for (int i=0;i<N;i++) P1[i].x-=3.0*P2[i].x;
	for (int i=0;i<N;i++) P1[i].x/=6.0;
	for (int i=0;i<N;i++) if ((ll)P1[i].x!=0) printf("%d : %lld\n",i-Delta*3,(ll)P1[i].x);
	return 0;
}

Complex operator + (Complex A,Complex B){
	return Complex(A.x+B.x,A.y+B.y);
}

Complex operator - (Complex A,Complex B){
	return Complex(A.x-B.x,A.y-B.y);
}

Complex operator * (Complex A,Complex B){
	return Complex(A.x*B.x-A.y*B.y,A.x*B.y+A.y*B.x);
}

void FFT(Complex *P,int N,int opt)
{
	for (int i=0;i<N;i++) if (i<Rader[i]) swap(P[i],P[Rader[i]]);
	for (int i=1;i<N;i<<=1)
		for (int j=0;j<N;j=j+(i<<1))
			for (int k=0;k<i;k++)
			{
				Complex X=P[j+k],Y=P[j+k+i]*Complex(Wn[N/(i<<1)*k].x,Wn[N/(i<<1)*k].y*opt);
				P[j+k]=X+Y;P[j+k+i]=X-Y;
			}
	if (opt==-1) for (int i=0;i<N;i++) P[i].x=(ll)(P[i].x/N+0.5);
	return;
}
```