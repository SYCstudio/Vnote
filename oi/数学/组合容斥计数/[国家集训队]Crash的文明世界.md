# [国家集训队]Crash的文明世界
[BZOJ2159 Luogu4827]

Crash 小朋友最近迷上了一款游戏——文明5 (Civilization V)。在这个游戏中，玩家可以建立和发展自己的国家，通过外交和别的国家交流，或是通过战争征服别的国家。  
现在 Crash 已经拥有了一个 $n$个城市的国家，这些城市之间通过道路相连。由于建设道路是有花费的，因此 Crash 只修建了 $n-1$条道路连接这些城市，不过可以保证任意两个城市都有路径相通。  
在游戏中，Crash 需要选择一个城市作为他的国家的首都，选择首都需要考虑很多指标，有一个指标是这样的：  
$$S(i) = \sum _ {j = 1}^{n}{\rm dist}(i, j) ^ k$$  
其中 $S(i)$表示第 $i$个城市的指标值，${\rm dist}(i, j)$表示第 $i$个城市到第 $j$个城市需要经过的道路条数的最小值，$k$为一个常数且为正整数。  
因此 Crash 交给你一个简单的任务：给出城市之间的道路，对于每个城市，输出这个城市的指标值，由于指标值可能会很大，所以你只需要输出这个数$\rm mod\ 10007$的值。

考虑第二类斯特林数的组合意义，有一个与幂有关的式子

$$m^n=\sum _ {i=1}^m S(n,i) i! \binom{m}{i}$$

意思是， $m^n$ 可以看做是把 n 个有区别的球放到 m 个有区别的盒子中，那么枚举其中非空盒的数量，组合数选出空盒，把球分配到空盒中，由于斯特林数中的盒子是无序的，所以再乘上一个阶乘变成有序的。  
有了这个式子，把它带进去。

$$S=\sum _ {i=1}^nd _ i^K=\sum _ {i=1}^n\sum _ {j=1}^{d _ i}\binom{d _ i}{j}j!S(K,j)=\sum _ {j=1}^dS(K,j)j!\sum _ {i=1}^n\binom{d _ i}{j}$$

注意到当 j>K 时斯特林数 S(K,j) 为０ ，也就是说 j 只需要枚举到 K 即可。那么问题就在于统计 $\sum _ {i=1}^n \binom{d _ i}{j}$ ，由于需要在每一个点得到全局的答案，自然想到两次树上 DP 的方式，但是直接用一个变量记录下信息不好维护转移，由于组合数有着 $\binom{i}{j}=\binom{i-1}{j}+\binom{i-1}{j-1}$ 的良好性质，那么可以直接维护一个 $O(nK)$ 的数组，这样转移的时候就只是加减了。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
using namespace std;

const int maxN=50500;
const int maxM=maxN<<1;
const int maxK=151;
const int Mod=10007;

int n,K;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int F[maxN][maxK],Bp[maxK];
int S[maxK][maxK],Fac[maxN];

void Add_Edge(int u,int v);
void dfs1(int u,int fa);
void dfs2(int u,int fa);
int Plus(int x,int y);
int Minus(int x,int y);

int main(){
	memset(Head,-1,sizeof(Head));
	int L,now,A,B,Q,tmp;scanf("%d%d%d%d%d%d%d",&n,&K,&L,&now,&A,&B,&Q);
	for (int i=1;i<n;i++){
		now=(now*A+B)%Q;tmp=(i<L)?i:L;
		int u=i-now%tmp,v=i+1;
		Add_Edge(u,v);Add_Edge(v,u);
	}
	dfs1(1,0);
	dfs2(1,0);
	S[0][0]=1;Fac[0]=1;for (int i=1;i<=K;i++) Fac[i]=1ll*Fac[i-1]*i%Mod;
	for (int i=1;i<=K;i++) for (int j=1;j<=i;j++) S[i][j]=(S[i-1][j-1]+1ll*j*S[i-1][j]%Mod)%Mod;
	for (int i=1;i<=n;i++){
		int sum=0;
		for (int j=1;j<=K;j++) sum=(sum+1ll*S[K][j]*Fac[j]%Mod*F[i][j]%Mod)%Mod;
		printf("%d\n",sum);
	}
	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs1(int u,int fa){
	F[u][0]=1;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			int v=V[i];dfs1(v,u);
			F[u][0]=Plus(F[u][0],F[v][0]);
			for (int j=1;j<=K;j++) F[u][j]=Plus(Plus(F[u][j],F[v][j-1]),F[v][j]);
		}
	return;
}

void dfs2(int u,int fa){
	if (fa!=0){
		for (int i=0;i<=K;i++) Bp[i]=F[fa][i];
		Bp[0]=Minus(Bp[0],F[u][0]);
		for (int i=1;i<=K;i++) Bp[i]=Minus(Minus(Bp[i],F[u][i]),F[u][i-1]);
		F[u][0]=Plus(F[u][0],Bp[0]);
		for (int i=1;i<=K;i++) F[u][i]=Plus(Plus(F[u][i],Bp[i-1]),Bp[i]);
	}
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa) dfs2(V[i],u);
	return;
}

int Plus(int x,int y){
	x+=y;if (x>=Mod) x-=Mod;
	return x;
}

int Minus(int x,int y){
	x-=y;if (x<0) x+=Mod;
	return x;
}
```