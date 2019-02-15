# Strange Way to Express Integers
[POJ2891]

Elina is reading a book written by Rujia Liu, which introduces a strange way to express non-negative integers. The way is described as following:  
Choose k different positive integers a1, a2, …, ak. For some non-negative m, divide it by every ai (1 ≤ i ≤ k) to find the remainder ri. If a1, a2, …, ak are properly chosen, m can be determined, then the pairs (ai, ri) can be used to express m.  
“It is easy to calculate the pairs from m, ” said Elina. “But how can I find m from the pairs?”  
Since Elina is new to programming, this problem is too difficult for her. Can you help her?

扩展中国剩余定理。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010000;
const int inf=2147483647;

int n;
ll A[maxN],M[maxN];

ll Exgcd(ll a,ll b,ll &x,ll &y);

int main(){
	while (scanf("%d",&n)!=EOF){
		for (int i=1;i<=n;i++) scanf("%lld%lld",&M[i],&A[i]);
		bool flag=1;
		for (int i=2;i<=n;i++){
			ll x=0,y=0;
			ll gcd=Exgcd(M[1],M[i],x,y);ll p=A[i]-A[1];
			if (p%gcd!=0){
				flag=0;break;
			}
			ll t=M[i]/gcd;x=x*p/gcd;
			x=(x%t+t)%t;
			A[1]=A[1]+x*M[1];M[1]=M[1]/gcd*M[i];A[1]=A[1]%M[1];
		}
		if (flag==0) printf("-1\n");
		else printf("%lld\n",(A[1]%M[1]+M[1])%M[1]);
	}

	return 0;
}

ll Exgcd(ll a,ll b,ll &x,ll &y){
	if (a==0){
		x=0;y=1;return b;
	}
	ll gcd=Exgcd(b%a,a,x,y);
	ll t=x;x=y-b/a*x;y=t;
	return gcd;
}
```