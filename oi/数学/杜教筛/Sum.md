# Sum
[BZOJ3944 Luogu4213]

给定一个正整数 $N(N\le2^{31}-1)$  
求 
$$ans _ 1=\sum _ {i=1}^n\varphi(i)$$  
$$ans _ 2=\sum _ {i=1}^n \mu(i)$$

直接杜教筛

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<map>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=6000000;
const int inf=2147483647;

bool notprime[maxN];
int pricnt,Prime[maxN];
ll Mu[maxN],Phi[maxN];
map<ll,ll> mu,phi;

void Init();
ll CalcMu(ll n);
ll CalcPhi(ll n);

int main(){
	Init();
	int TTT;scanf("%d",&TTT);
	while (TTT--){
		ll n;scanf("%lld",&n);
		if (n==0){
			printf("0 0\n");continue;
		}
		printf("%lld %lld\n",CalcPhi(n),CalcMu(n));
	}

	return 0;
}

void Init(){
	Mu[1]=1;Phi[1]=1;notprime[1]=1;
	for (int i=2;i<maxN;i++){
		if (notprime[i]==0) Mu[i]=-1,Phi[i]=i-1,Prime[++pricnt]=i;
		for (int j=1;(j<=pricnt)&&(1ll*i*Prime[j]<maxN);j++){
			int p=Prime[j];
			notprime[i*p]=1;
			if (i%p==0){
				Phi[i*p]=Phi[i]*p;Mu[i*p]=0;break;
			}
			Phi[i*p]=Phi[i]*(p-1);Mu[i*p]=-Mu[i];
		}
	}

	for (int i=2;i<maxN;i++) Mu[i]+=Mu[i-1],Phi[i]+=Phi[i-1];
	return;
}

ll CalcMu(ll n){
	if (n<maxN) return Mu[n];
	if (mu.count(n)) return mu[n];
	ll ret=0;
	for (ll i=2,j;i<=n;i=j+1){
		j=n/(ll)(n/i);
		ret=ret+(j-i+1)*CalcMu(n/i);
	}
	return mu[n]=1-ret;
}

ll CalcPhi(ll n){
	if (n<maxN) return Phi[n];
	if (phi.count(n)) return phi[n];
	ll ret=0;
	for (ll i=2,j;i<=n;i=j+1){
		j=n/(ll)(n/i);
		ret=ret+(j-i+1)*CalcPhi(n/i);
	}
	return phi[n]=n*(n+1)/2-ret;
}
```