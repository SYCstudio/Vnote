# Ceizenpok’s formula
[CF Gym100633J]

Dr. Ceizenp'ok from planet i1c5l became famous across the whole Universe thanks to his recent discovery — the Ceizenpok’s formula. This formula has only three arguments: n, k and m, and its value is a number of k-combinations of a set of n modulo m.  
While the whole Universe is trying to guess what the formula is useful for, we need to automate its calculation.

求$C(n,m) \mod{p}$

直接扩展卢卡斯定理。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstdlib>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=50;
const int inf=2147483647;

ll QPow(ll x,ll cnt,ll P);
ll GetFac(ll n,ll p,ll P);
ll GetInv(ll x,ll P);
ll Exgcd(ll a,ll b,ll &x,ll &y);
ll GetC(ll n,ll m,ll P);
ll ExLucas(ll n,ll m,ll P);

int main(){
	ll n,m,P;scanf("%lld%lld%lld",&n,&m,&P);
	printf("%lld\n",ExLucas(n,m,P));
	return 0;
}

ll QPow(ll x,ll cnt,ll P){
	ll ret=1;
	while (cnt){
		if (cnt&1) ret=ret*x%P;
		x=x*x%P;cnt>>=1;
	}
	return ret;
}

ll GetFac(ll n,ll p,ll P){
	if (n==0) return 1;
	ll ret=1;
	for (ll i=1;i<=P;i++) if (i%p) ret=ret*i%P;
	ret=QPow(ret,n/P,P);
	for (ll i=1;i<=n%P;i++) if (i%p) ret=ret*i%P;
	return ret*GetFac(n/p,p,P)%P;
}

ll Exgcd(ll a,ll b,ll &x,ll &y){
	if (b==0){
		x=1;y=0;return a;
	}
	ll gcd=Exgcd(b,a%b,x,y);
	ll t=x;
	x=y;y=t-a/b*y;return gcd;
}

ll GetInv(ll x,ll P){
	ll a,b;
	Exgcd(x,P,a,b);
	a=(a%P+P)%P;
	return a;
}

ll GetC(ll n,ll m,ll p,ll P){
	if (m>n) return 0;
	ll pcnt=0;
	for (ll i=n;i;i/=p) pcnt+=i/p;
	for (ll i=m;i;i/=p) pcnt-=i/p;
	for (ll i=n-m;i;i/=p) pcnt-=i/p;
	ll a=GetFac(n,p,P),b=GetFac(m,p,P),c=GetFac(n-m,p,P);
	return QPow(p,pcnt,P)*a%P*GetInv(b,P)%P*GetInv(c,P)%P;
}

ll ExLucas(ll n,ll m,ll P){
	ll x=P,Ret=0;
	for (ll i=2;i<=x;i++)
		if (x%i==0){
			ll pi=i,pk=i;
			x/=i;
			while (x%i==0) x/=i,pk*=i;
			ll rt=GetC(n,m,pi,pk);
			Ret=(Ret+rt*(P/pk)%P*GetInv(P/pk,pk)%P)%P;
		}
	return Ret;
}
```