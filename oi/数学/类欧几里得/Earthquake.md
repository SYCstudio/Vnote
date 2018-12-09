# Earthquake
[BZOJ2987]

给定a,b,c,求满足方程Ax+By<=C的非负整数解  
A,B<=10^9.C<=Min(A,B)*10^9

即求 $\sum_{i=0}^n \lfloor \frac{-bi+a+c}{a}\rfloor,n=\lfloor \frac{c}{b}\rfloor$ ，直接类欧就好了。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int inf=2147483647;

ll Calc(ll a,ll b,ll c,ll n);

int main(){
	ll a,b,c;scanf("%lld%lld%lld",&a,&b,&c);
	printf("%lld\n",Calc(-b,a+c,a,c/b));
}

ll Calc(ll a,ll b,ll c,ll n){
	if (n<0) return 0;
	if (n==0) return b/c;
	if (a==0) return (n+1)*(b/c);
	if ((a>=0)&&(a<c)&&(b>=0)&&(b<c)){
		ll f=(a*n+b)/c;return f*n-Calc(c,c-b-1,a,f-1);
	}
	ll p=(a>=0)?(a/c):(a/c-1),q=a-p*c,m=(b>=0)?(b/c):(b/c-1),t=b-m*c;
	if (n&1) return Calc(q,t,c,n)+(n+1)/2*n*p+(n+1)*m;
	else return Calc(q,t,c,n)+n/2*(n+1)*p+(n+1)*m;
}
```