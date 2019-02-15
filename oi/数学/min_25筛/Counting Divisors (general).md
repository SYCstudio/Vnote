# Counting Divisors (general)
[SPOJ-DIVCNTK]

$\sigma_0(i)$ 表示$i$ 的约数个数  
求$S_k(n)=\sum_{i=1}^n\sigma_0(i^k)\mod 2^{64}$   
多测,$T\le10^4,n,k\le10^{10}$

设 $f(x)=\sigma(x^k)$ ，不难发现 $f(x)$ 为积性函数，且 $f(p)=K+1,f(p^c)=Kc+1$ ，则 min25 求出质数个数之和之后，直接转化成要求的 f(x) 。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
using namespace std;

#define ull unsigned long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define RG register
#define IL inline

const int maxN=101000;
const int inf=2147483647;

ull n,K,srt;
bool notprime[maxN];
int pcnt,P[maxN];
ull num,Num[maxN+maxN],Id[maxN+maxN],G[maxN+maxN],H[maxN+maxN],Sum[maxN+maxN];

IL void Init();
IL int GetId(RG ull x);
ull Calc(RG ull m,RG ull k);
ull S(RG ull x,RG int p);

int main(){
	Init();RG int TTT;RG ull nn,k;
	scanf("%d",&TTT);
	while (TTT--){
		scanf("%llu%llu",&nn,&k);
		printf("%llu\n",Calc(nn,k));
	}
	return 0;
}

IL void Init(){
	notprime[1]=1;
	for (RG int i=2;i<maxN;++i){
		if (notprime[i]==0) P[++pcnt]=i,Sum[pcnt]=Sum[pcnt-1]+i;
		for (RG int j=1;(j<=pcnt)&&(1ll*i*P[j]<maxN);++j){
			notprime[i*P[j]]=1;if (i%P[j]==0) break;
		}
	}
	return;
}

IL int GetId(RG ull x){
	if (x<=srt) return Id[x];
	else return Id[n/x+maxN];
}

IL ull Calc(RG ull m,RG ull k){
	num=0;n=m;srt=sqrt(m);K=k;
	for (RG ull i=1,j;i<=n;i=j+1){
		j=n/i;Num[++num]=j;
		H[num]=j-1;
		if (j<=srt) Id[j]=num;
		else Id[i+maxN]=num;j=n/j;
	}
	for (RG int j=1;j<=pcnt;++j)
		for (RG int i=1;(i<=num)&&(1ll*P[j]*P[j]<=Num[i]);++i)
			H[i]=H[i]-H[GetId(Num[i]/P[j])]+j-1;
	return S(m,1)+1;
}

ull S(RG ull x,RG int p){
	if ((x<=1)||(P[p]>x)) return 0;
	RG int id=GetId(x);RG ull ret=(H[id]-(p-1))*(K+1);
	for (RG int i=p;(i<=pcnt)&&(1ll*P[i]*P[i]<=x);++i){
		RG ull mul=P[i];
		for (RG int j=1;mul*P[i]<=x;j++,mul*=P[i])
			ret=ret+S(x/mul,i+1)*(K*j+1)+(ull)K*(j+1)+1;
	}
	return ret;
}
```