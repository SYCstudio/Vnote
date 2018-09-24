# [USACO18JAN]Cow at Large P
[BZOJ5186 Luogu4183]

贝茜被农民们逼进了一个偏僻的农场。农场可视为一棵有 $N$ 个结点的树，结点分别编号为 $1,2,\ldots, N$ 。每个叶子结点都是出入口。开始时，每个出入口都可以放一个农民（也可以不放）。每个时刻，贝茜和农民都可以移动到相邻的一个结点。如果某一时刻农民与贝茜相遇了（在边上或点上均算），则贝茜将被抓住。抓捕过程中，农民们与贝茜均知道对方在哪个结点。  
请问：对于结点 $i\,(1\le i\le N)$ ，如果开始时贝茜在该结点，最少有多少农民，她才会被抓住。

考虑以 x 为根的时候，设 dis[u] 表示 u 到 x  的距离， mn[u] 表示 u 到最近的叶子节点的距离。最优策略一定是农民顺着边一直往根节点走，因为越往上走能够覆盖的叶子就越多，需要的农民数量就越少。当 dis[u]<mn[u] 的时候，贝茜比农民先到达这个节点，说明这里至少需要一个农民。也就说，每出现一个 dis[u]>=mn[u] 且 dis[fa[u]]<mn[fa[u]] 时，答案+1 。  
同时我们发现，满足 dis[u]>=mn[u] 的所有节点构成了若干子树，而子树的数量就是需要求的答案。现在的问题是，如何通过点的信息得到子树的个数。  
对于大小为 K 的子树的度数和边的关系，有公式 $\sum _ {v}Dg[v]=2(k-1)+1$ 所以就有 $\sum _ {v}(2-Dg[v])=1$ ，也就是说，通过点的度数之和，可以得到这些点构成的子树的个数。  
如何快速地求出每一个点的答案呢？考虑用总答案减去不合法的点的贡献，带入式子发现总答案就是 2 。剩下的考虑用点分治来计算。点分治重心 x ，考虑所有经过 x 的点对是否合法。设 dis[u] 表示 u 到分治重心 x 的距离，假设有在两个子树中的点 u,v ，u 对 v 的答案不合法当且仅当 dis[u]+dis[v]<mn[u] ，即 dis[v]<mn[u]-dis[u] ，开一个桶来统计一下。注意要减去在一颗子树中的贡献。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=71000;
const int maxM=maxN<<1;
const int inf=2147483647;

int n,m;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM],Dg[maxN],Ans[maxN];
int Mn[maxN];
int root,nowsum=0,Mx[maxN],Size[maxN],Dis[maxN];
int mxd=0,mxd2,Sum1[maxN],Sum2[maxN];
bool vis[maxN];

void Add_Edge(int u,int v);
void dfs_dp1(int u,int fa);
void dfs_dp2(int u,int fa);
void dfs_root(int u,int fa);
void Solve(int u);
void dfs_inc(int u,int fa,int d);
void dfs_exc(int u,int fa);
void dfs_calc(int u,int fa);

int main(){
	mem(Head,-1);
	scanf("%d",&n);
	for (int i=1;i<n;i++){
		int u,v;scanf("%d%d",&u,&v);Dg[u]++;Dg[v]++;
		Add_Edge(u,v);Add_Edge(v,u);
	}

	dfs_dp1(1,1);
	dfs_dp2(1,1);
	root=0;Mx[0]=inf;nowsum=n;dfs_root(1,1);
	Solve(root);

	for (int i=1;i<=n;i++)
		if (Dg[i]==1) printf("1\n");
		else printf("%d\n",2-Ans[i]);

	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs_dp1(int u,int fa){
	Mn[u]=inf;
	if (Dg[u]==1) Mn[u]=0;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			dfs_dp1(V[i],u);Mn[u]=min(Mn[u],Mn[V[i]]+1);
		}
	return;
}

void dfs_dp2(int u,int fa){
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			Mn[V[i]]=min(Mn[V[i]],Mn[u]+1);dfs_dp2(V[i],u);
		}
	return;
}

void dfs_root(int u,int fa){
	Size[u]=1;Mx[u]=0;
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=fa)&&(vis[V[i]]==0)){
			dfs_root(V[i],u);
			Size[u]+=Size[V[i]];Mx[u]=max(Mx[u],Size[V[i]]);
		}
	Mx[u]=max(Mx[u],nowsum-Size[u]);
	if (Mx[u]<Mx[root]) root=u;return;
}

void Solve(int u){
	vis[u]=1;
	mxd=0;dfs_inc(u,0,0);
	for (int i=mxd-1;i>=1;i--) Sum1[i]+=Sum1[i+1];
	Ans[u]+=Sum1[1];
	for (int i=Head[u];i!=-1;i=Next[i])
		if (vis[V[i]]==0){
			mxd2=0;dfs_exc(V[i],u);
			for (int j=mxd2-1;j>=1;j--) Sum2[j]+=Sum2[j+1];
			dfs_calc(V[i],u);
			for (int j=mxd2;j>=1;j--) Sum2[j]=0;
		}
	for (int i=mxd;i>=0;i--) Sum1[i]=0;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (vis[V[i]]==0){
			root=0;nowsum=Size[V[i]];
			dfs_root(V[i],V[i]);Solve(root);
		}
	return;
}

void dfs_inc(int u,int fa,int d){//容
	Dis[u]=d;int k=Mn[u]-d;
	if (k>0) mxd=max(mxd,k),Sum1[k]+=2-Dg[u];
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=fa)&&(vis[V[i]]==0)) dfs_inc(V[i],u,d+1);
	return;
}

void dfs_exc(int u,int fa){//斥
	int k=Mn[u]-Dis[u];
	if (k>0) mxd2=max(mxd2,k),Sum2[k]+=2-Dg[u];
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=fa)&&(vis[V[i]]==0)) dfs_exc(V[i],u);
	return;
}

void dfs_calc(int u,int fa){
	Ans[u]+=Sum1[Dis[u]+1]-Sum2[Dis[u]+1];
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=fa)&&(vis[V[i]]==0)) dfs_calc(V[i],u);
	return;
}
```