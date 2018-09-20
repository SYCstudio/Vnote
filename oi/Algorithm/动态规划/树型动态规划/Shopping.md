# Shopping
[BZOJ4182]

马上就是小苗的生日了，为了给小苗准备礼物，小葱兴冲冲地来到了商店街。商店街有n个商店，并且它们之间的道路构成了一颗树的形状。  
第i个商店只卖第i种物品，小苗对于这种物品的喜爱度是wi，物品的价格为ci，物品的库存是di。但是商店街有一项奇怪的规定：如果在商店u,v买了东西，并且有一个商店w在u到v的路径上，那么必须要在商店w买东西。小葱身上有m元钱，他想要尽量让小苗开心，所以他希望最大化小苗对买到物品的喜爱度之和。这种小问题对于小葱来说当然不在话下，但是他的身边没有电脑，于是他打电话给同为OI选手的你，你能帮帮他吗？

要求是在树上选一个连通块做树上背包，点分治转化为求一定选重心的背包问题。如果一个子树中，子树的顶不选，那么整个子树就不选。普通的树型 DP 不好处理这种子树选或不选的，那么把树的 dfs 序提出来，设 F[i][j] 表示在 dfs 序第 i 个到最后一个这些点中选择，总价格为 j 的最大喜爱度之和，那么如果 i 这个点选，就可以从 i+1 转移过来，否则要从 i 对应的点的 lst +1转移过来。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=510;
const int maxW=4010;
const int maxM=maxN<<1;
const int inf=2147483647;

int n,m;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int root,nowsum,Mx[maxN],Size[maxN];
int C[maxN],D[maxN],W[maxN];
int dfncnt,dfn[maxN],nfd[maxN],lst[maxN];
bool vis[maxN];
int F[maxN][maxW],Ans=0;

void Add_Edge(int u,int v);
void GetRoot(int u,int fa);
void Solve(int u);
void dfs_dfn(int u,int fa);

int main(){
	int TTT;scanf("%d",&TTT);
	while (TTT--){
		edgecnt=Ans=0;mem(Head,-1);mem(vis,0);
		scanf("%d%d",&n,&m);
		for (int i=1;i<=n;i++) scanf("%d",&W[i]);
		for (int i=1;i<=n;i++) scanf("%d",&C[i]);
		for (int i=1;i<=n;i++) scanf("%d",&D[i]);
		for (int i=1;i<n;i++){
			int u,v;scanf("%d%d",&u,&v);
			Add_Edge(u,v);Add_Edge(v,u);
		}

		Mx[root=0]=inf;GetRoot(1,1);GetRoot(root,root);
		Solve(root);

		printf("%d\n",Ans);
	}

	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void GetRoot(int u,int fa){
	Size[u]=1;Mx[u]=0;
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=fa)&&(vis[V[i]]==0)){
			GetRoot(V[i],u);Mx[u]=max(Mx[u],Size[V[i]]);
			Size[u]+=Size[V[i]];
		}
	Mx[u]=max(Mx[u],nowsum-Size[u]);
	if (Mx[u]<Mx[root]) root=u;return;
}

void Solve(int u){
	vis[u]=1;dfncnt=0;dfs_dfn(u,u);
	for (int i=1;i<=dfncnt+1;i++) for (int j=0;j<=m;j++) F[i][j]=0;
	for (int i=dfncnt;i>=1;i--){
		int u=nfd[i];
		for (int j=C[u];j<=m;j++) F[i][j]=F[i+1][j-C[u]]+W[u];
		int d=D[u]-1;
		for (int j=1;j<=d;d-=j,j<<=1)
			for (int k=m;k>=C[u]*j;k--) F[i][k]=max(F[i][k],F[i][k-C[u]*j]+W[u]*j);
		if (d)
			for (int k=m;k>=C[u]*d;k--) F[i][k]=max(F[i][k],F[i][k-C[u]*d]+W[u]*d);

		for (int j=m;j>=0;j--) F[i][j]=max(F[i][j],F[lst[u]+1][j]);
	}
	for (int i=0;i<=m;i++) Ans=max(Ans,F[1][i]);

	for (int i=Head[u];i!=-1;i=Next[i])
		if (vis[V[i]]==0){
			root=0;nowsum=Size[V[i]];
			GetRoot(V[i],V[i]);GetRoot(root,root);
			Solve(root);
		}
	return;
}

void dfs_dfn(int u,int fa){
	nfd[dfn[u]=++dfncnt]=u;
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=fa)&&(vis[V[i]]==0))
			dfs_dfn(V[i],u);
	lst[u]=dfncnt;
}
```