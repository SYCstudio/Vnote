# 数列的GCD
[BZOJ4305]

给出一个长度为N的数列{a[n]}，1<=a[i]<=M(1<=i<=N)。  
现在问题是，对于1到M的每个整数d，有多少个不同的数列b[1], b[2], ..., b[N]，满足：  
(1)1<=b[i]<=M(1<=i<=N)；  
(2)gcd(b[1], b[2], ..., b[N])=d；  
(3)恰好有K个位置i使得a[i]<>b [i] _ (1<=i<=N)  
注：gcd(x1,x2,...,xn)为x1, x2, ..., xn的最大公约数。  
输出答案对1,000,000,007取模的值。

设答案为 $f[i]$ ，而 $g[i]=\sum _ {j|i} f[i]$是比较好求的，讨论一下得到 $g[i]=C(S[i],K-(n-S[i]))(\lfloor \frac{m}{i} \rfloor -1) ^ {K-(n-S[i])}(\lfloor \frac{m}{i} \rfloor ) ^ {n-S[i]}$，其中 $S[i]$ 是 $i$ 的倍数的个数。最后再容斥地减掉大于的答案即得到 $f$ 。

```c[[
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define NAME "number"

const int maxN=501000;
const int Mod=1e9+7;
const int inf=2147483647;

int n,m,K;
int Cnt[maxN],Sum[maxN];
int Ans[maxN];
int Fac[maxN],Inv[maxN];

int QPow(int x,int cnt);
int GetC(int n,int m);

int main(){
	Fac[0]=Inv[0]=1;
	for (int i=1;i<maxN;i++) Fac[i]=1ll*Fac[i-1]*i%Mod;
	Inv[maxN-1]=QPow(Fac[maxN-1],Mod-2);
	for (int i=maxN-2;i>=1;i--) Inv[i]=1ll*Inv[i+1]*(i+1)%Mod;
	mem(Cnt,0);mem(Sum,0);mem(Ans,0);
	scanf("%d%d%d",&n,&m,&K);
	for (int i=1;i<=n;i++){
		int key;scanf("%d",&key);Cnt[key]++;
	}
	for (int i=1;i<=m;i++)
		for (int j=i;j<=m;j+=i)
			Sum[i]+=Cnt[j];
	for (int i=m;i>=1;i--){
		if (n-Sum[i]<=K) Ans[i]=1ll*GetC(Sum[i],K-(n-Sum[i]))*QPow(m/i-1,K-(n-Sum[i]))%Mod*QPow(m/i,n-Sum[i])%Mod;
		else Ans[i]=0;
		for (int j=i+i;j<=m;j+=i) Ans[i]=(Ans[i]-Ans[j]+Mod)%Mod;
	}

	for (int i=1;i<=m;i++) printf("%d ",Ans[i]);printf("\n");

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

int GetC(int n,int m){
	//cerr<<"GetC:"<<n<<" "<<m<<" "<<1ll*Fac[n]*Inv[m]%Mod*Inv[n-m]%Mod<<endl;
	if (n<m) return 0;
	return 1ll*Fac[n]*Inv[m]%Mod*Inv[n-m]%Mod;
}

```