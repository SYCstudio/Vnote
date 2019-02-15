# Stop. Otherwise...
[ARC102E]

Takahashi throws N dice, each having K sides with all integers from 1 to K. The dice are NOT pairwise distinguishable. For each i=2,3,...,2K, find the following value modulo 998244353:      
The number of combinations of N sides shown by the dice such that the sum of no two different sides is i.  
Note that the dice are NOT distinguishable, that is, two combinations are considered different when there exists an integer k such that the number of dice showing k is different in those two.

有 n 个骰子，每个骰子有 K 个面，现在要对 i=[2,2K] 的每一个 i 求满足不存在任何一对骰子的点数之和为 i 的方案数。骰子之间是相同的。

考虑容斥，要求不存在点数之和为 i 的骰子对，也就是说，存在一些数对要求这些数对中的数仅能出现其中的一种，设总共有 m 种，枚举有多少种这样的数，那么根据二项式反演有 $Ans_K=\sum _ {i=0}^m (-1)^{i} \binom{m}{i} \binom{n-2i+K-1}{K-1}$

```cpp
#include<cstdio>
#include<cstdlib>
#include<algorithm>
#include<iostream>
using namespace std;

#define ll long long

const int maxN=20010;
const int Mod=998244353;

int Fac[maxN],Ifc[maxN];

int QPow(int x,int cnt);
int C(int n,int m);

int main(){
	int n,K;
	Fac[0]=Ifc[0]=1;for (int i=1;i<maxN;i++) Fac[i]=1ll*Fac[i-1]*i%Mod;
	Ifc[maxN-1]=QPow(Fac[maxN-1],Mod-2);for (int i=maxN-2;i>=1;i--) Ifc[i]=1ll*Ifc[i+1]*(i+1)%Mod;
	scanf("%d%d",&K,&n);
	for (int i=2;i<=K+K;i++){
		int sum=0,mm=(min(i-1,K)-max(i-K,1)+2)/2;
		for (int j=0;j+j<=n;j++) sum=((1ll*((j&1)?(-1):(1))*C(mm,j)%Mod*C(n-2*j+K-1,K-1)%Mod+sum)%Mod+Mod)%Mod;
		printf("%d\n",sum);
	}
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

int C(int n,int m){
	if (n<m) return 0;
	return 1ll*Fac[n]*Ifc[n-m]%Mod*Ifc[m]%Mod;
}
```