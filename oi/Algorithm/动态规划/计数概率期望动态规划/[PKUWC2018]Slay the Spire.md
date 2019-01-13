# [PKUWC2018]Slay the Spire
[LOJ2538 BZOJ5467]

九条可怜在玩一个很好玩的策略游戏：Slay the Spire，一开始九条可怜的卡组里有 $2n$ 张牌，每张牌上都写着一个数字$w_i$，一共有两种类型的牌，每种类型各 $n$ 张：  
1. 攻击牌：打出后对对方造成等于牌上的数字的伤害。  
2. 强化牌：打出后，假设该强化牌上的数字为 $x$，则其他剩下的**攻击牌**的数字都会乘上 $x$。**保证强化牌上的数字都大于 1**。  
现在九条可怜会等概率随机从卡组中抽出 $m$ 张牌，由于费用限制，九条可怜最多打出 $k$ 张牌，假设九条可怜永远都会采取能造成最多伤害的策略，求她期望造成多少伤害。  
假设答案为 $\text{ans}$，你只需要输出  
$$\left (\text{ans}\times \frac{(2n)!}{m!(2n-m)!}\right) ~\bmod 998244353$$即可  
其中 $x!$ 表示 $\prod_{i=1}^{x}i$，特别地，$0!=1$

首先由于所有的强化牌强化的系数都大于 1 ，所以若得到一组牌，一定是尽量把大的强化牌先全部打完，再从大的往小打攻击牌。注意到当强化牌数量大于等于 K 时，此时不能全部都打强化牌，至少要留最后一张牌为攻击牌。  
那么设 F[i][j] 表示牌组中有 i 张强化牌，打出 j 张的最优方案倍率和， G[i][j] 类似，为攻击牌的。那么枚举抽出的牌组中有几张强化牌，设为 p ，根据上面的分析，有

$$
\sum _ {P=1} ^ m
\begin{cases}
F[p][p] \times G[m-p][K-p] & p<K \\\\
F[p][K-1] \times G[m-p][1] & p \ge K
\end{cases}
$$

那么现在的问题就是求 F 和 G 。将两种牌分别按照权值从大到小排序，设 f[i][j] 表示选了 i 张强化牌，最后一张为 j 的最优方案倍率和， g[i][j] 类似，为攻击牌的。以强化牌为例，求解 F[i][j] ，枚举最后一张强化牌的位置 l，由于已经按照权值从大到小排序了，所以选择前面的一定更优，那么剩余的 (i-j) 张不会被用到的强化牌就一定是从后 n-l 中选的。唯一要注意的就是当 j 为 0 的时候，此时就是 $\binom{n}{i}$ 。对于攻击牌的分析是类似的，那么就有

$$
F[i][j]=\begin{cases}
\sum _ {l=1} ^ n f[j][l] \binom{n-l}{i-j} & j>0 \\\\
\binom{n}{i} & j=0
\end{cases} \\\\
G[i][j]=\sum _ {l=1} ^ n g[j][l]\binom{n-l}{i-j}
$$

现在的问题又转化为求 f 和 g，这个就比较方便了。由于牌都是已经按照降序排好序了的，那么在前面的如果选了就一定要选。基于这个思想，可以得到方程

$$
f[i][j]=\sum _ {l=1} ^ {i-1} f[l][j-1] \times W[j] \\\\
g[i][j]=\binom{i-1}{j-1} \times W[j]+\sum _ {l=1} ^ {i-1} g[l][j-1]
$$

那么预处理出 f 和 g ，枚举 p 计算答案。注意到 F 和 G 是不需要全部算出来的，所以可以在枚举 p 的时候现算。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=3010;
const int Mod=998244353;

int n,m,K;
int W1[maxN],W2[maxN];
int f[maxN][maxN],g[maxN][maxN],s[maxN][maxN];
int Fc[maxN],Ifc[maxN];

int QPow(int x,int cnt);
int C(int n,int m);
int F(int a,int b);
int G(int a,int b);

int main(){
	Fc[0]=Ifc[0]=1;for (int i=1;i<maxN;i++) Fc[i]=1ll*Fc[i-1]*i%Mod;
	Ifc[maxN-1]=QPow(Fc[maxN-1],Mod-2);for (int i=maxN-2;i>=1;i--) Ifc[i]=1ll*Ifc[i+1]*(i+1)%Mod;
	int Case;scanf("%d",&Case);
	while (Case--){
		scanf("%d%d%d",&n,&m,&K);
		for (int i=1;i<=n;i++) scanf("%d",&W1[i]);
		for (int i=1;i<=n;i++) scanf("%d",&W2[i]);
		sort(&W1[1],&W1[n+1]);reverse(&W1[1],&W1[n+1]);
		sort(&W2[1],&W2[n+1]);reverse(&W2[1],&W2[n+1]);
		for (int i=1;i<=n;i++){
			f[1][i]=W1[i];s[1][i]=(s[1][i-1]+f[1][i])%Mod;
		}
		for (int i=2;i<=n;i++)
			for (int j=1;j<=n;j++){
				f[i][j]=1ll*s[i-1][j-1]*W1[j]%Mod;
				s[i][j]=(s[i][j-1]+f[i][j])%Mod;
			}
		for (int i=1;i<=n;i++){
			g[1][i]=W2[i];s[1][i]=(s[1][i-1]+g[1][i])%Mod;
		}
		for (int i=2;i<=n;i++)
			for (int j=1;j<=n;j++){
				g[i][j]=(1ll*C(j-1,i-1)*W2[j]%Mod+s[i-1][j-1])%Mod;
				s[i][j]=(s[i][j-1]+g[i][j])%Mod;
			}
		int Ans=0;
		for (int p=0;p<=m;p++){
			if ((p>n)||(m-p>n)) continue;
			if (p<K) Ans=(Ans+1ll*F(p,p)*G(m-p,K-p)%Mod)%Mod;
			else Ans=(Ans+1ll*F(p,K-1)*G(m-p,1)%Mod)%Mod;
		}
		printf("%d\n",Ans);
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
	if ((n<0)||(m<0)||(n<m)) return 0;
	return 1ll*Fc[n]*Ifc[n-m]%Mod*Ifc[m]%Mod;
}
int F(int a,int b){
	if (b==0) return C(n,a);
	int ret=0;
	for (int l=1;l<=n;l++) ret=(ret+1ll*f[b][l]*C(n-l,a-b)%Mod)%Mod;
	return ret;
}
int G(int a,int b){
	int ret=0;
	for (int l=1;l<=n;l++) ret=(ret+1ll*g[b][l]*C(n-l,a-b)%Mod)%Mod;
	return ret;
}
```