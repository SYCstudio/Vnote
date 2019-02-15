# Student's Camp
[CF708E]

Alex studied well and won the trip to student camp Alushta, located on the seashore.  
Unfortunately, it's the period of the strong winds now and there is a chance the camp will be destroyed! Camp building can be represented as the rectangle of n + 2 concrete blocks height and m blocks width.  
Every day there is a breeze blowing from the sea. Each block, except for the blocks of the upper and lower levers, such that there is no block to the left of it is destroyed with the probability $p=\frac{a}{b}$ Similarly, each night the breeze blows in the direction to the sea. Thus, each block (again, except for the blocks of the upper and lower levers) such that there is no block to the right of it is destroyed with the same probability p. Note, that blocks of the upper and lower level are indestructible, so there are only n·m blocks that can be destroyed.  
The period of the strong winds will last for k days and k nights. If during this period the building will split in at least two connected components, it will collapse and Alex will have to find another place to spend summer.  
Find the probability that Alex won't have to look for other opportunities and will be able to spend the summer in this camp.

首先可以得到一个 $O(n^3)$ 的 $DP$ ，设 $F[i][l][r]$ 表示到第 $i$ 层当前层连续段为 $[l,r]$ 的概率，那么前后缀和优化转移，设 $f[i][r]$ 表示第 $i$ 层右端点在 $r$ 左边的所有概率之和， $g[i][l]$ 类似的对右边求和，根据补集性质可以得到 $F[i][l][r]=(sum-f[i-1][l-1]-g[i-1][r+1]) \times P[l-1]P[m-r]$，其中 $P[i]$ 代表打 $T$ 次消掉 $i$ 个格子的概率。简化状态发现可以直接 $DP$ $f,g$，有 $f[i][r]=\sum _ {l=1} ^ r (sum-f[i-1][l-1]-g[i-1][r+1])P[l-1]P[m+1]$，化简后得到 $f[i][r]=P[m-r] \times ((sum-g[i-1][r+1])(\sum _ {l=1} ^ r P[l-1]) - (\sum _ {l=1} ^ r f[i-1][l-1]P[l-1]))$，同理有 $g[i][l]=P[l-1] \times ((sum-f[i-1][l-1])(\sum _ {r=l} ^ m P[m-r])- (\sum _ {r=l} ^ m g[i-1][r+1]P[m-r])$，那么分别统计 $P[i]$ 的前缀和以及 $f[i][j]P[j],g[i][j]P[m-j+1]$ 的前缀和就可以做到 $O(n^2)$ 的计算了。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define RG register
#define IL inline

const int maxN=1501;
const int maxNum=10000010;
const int Mod=1e9+7;
const int inf=2147483647;

int n,m,K;
int Fac[maxNum],Inv[maxNum];
int P[maxN],SP[maxN];
int F[maxN][maxN],G[maxN][maxN],S1[maxN][maxN],S2[maxN][maxN];

int QPow(int x,int cnt);
int GetC(int n,int m);
IL void Plus(RG int &x,RG int y);

int main(){
	RG int i,j,l,r;
	scanf("%d%d",&n,&m);
	int a,b;scanf("%d%d",&a,&b);scanf("%d",&K);
	int p=1ll*a*QPow(b,Mod-2)%Mod,np=(1-p+Mod)%Mod;
	Fac[0]=Inv[0]=1;for (i=1;i<maxNum;i++) Fac[i]=1ll*Fac[i-1]*i%Mod;
	Inv[maxNum-1]=QPow(Fac[maxNum-1],Mod-2);for (i=maxNum-2;i>=1;i--) Inv[i]=1ll*Inv[i+1]*(i+1)%Mod;

	for (i=0;i<=min(m,K);i++) P[i]=1ll*QPow(p,i)*QPow(np,K-i)%Mod*GetC(K,i)%Mod;
	SP[0]=P[0];for (i=1;i<maxN;i++) SP[i]=(SP[i-1]+P[i])%Mod;

	for (l=1;l<=m;l++)
		for (r=l;r<=m;r++){
			Plus(F[1][r],1ll*P[l-1]*P[m-r]%Mod);Plus(G[1][l],1ll*P[l-1]*P[m-r]%Mod);
		}
	for (i=1;i<=m;i++) Plus(F[1][i],F[1][i-1]),Plus(S1[1][i],1ll*F[1][i]*P[i]%Mod);
	for (i=m;i>=1;i--) Plus(G[1][i],G[1][i+1]),Plus(S2[1][i],1ll*G[1][i]*P[m-i+1]%Mod);
	for (i=1;i<=m;i++) Plus(S1[1][i],S1[1][i-1]);
	for (i=m;i>=1;i--) Plus(S2[1][i],S2[1][i+1]);

	for (i=2;i<=n;i++){
		RG int sum=F[i-1][m];
		for (j=1;j<=m;j++){
			Plus(F[i][j],1ll*(1ll*(sum-G[i-1][j+1])*SP[j-1]%Mod-S1[i-1][j-1])%Mod*P[m-j]%Mod);
			Plus(G[i][j],1ll*(1ll*(sum-F[i-1][j-1])*SP[m-j]%Mod-S2[i-1][j+1])%Mod*P[j-1]%Mod);
		}
		for (j=1;j<=m;j++) Plus(F[i][j],F[i][j-1]),Plus(S1[i][j],1ll*F[i][j]*P[j]%Mod);
		for (j=m;j>=1;j--) Plus(G[i][j],G[i][j+1]),Plus(S2[i][j],1ll*G[i][j]*P[m-j+1]%Mod);
		for (j=1;j<=m;j++) Plus(S1[i][j],S1[i][j-1]);
		for (j=m;j>=1;j--) Plus(S2[i][j],S2[i][j+1]);
	}

	printf("%d\n",F[n][m]);

	return 0;
}

int QPow(RG int x,RG int cnt){
	int ret=1;
	while (cnt){
		if (cnt&1) ret=1ll*ret*x%Mod;
		x=1ll*x*x%Mod;cnt>>=1;
	}
	return ret;
}

int GetC(RG int n,RG int m){
	if (n<m) return 0;
	return 1ll*Fac[n]*Inv[m]%Mod*Inv[n-m]%Mod;
}

IL void Plus(RG int &x,RG int y){
	x=((x+y)%Mod+Mod)%Mod;return;
}
```