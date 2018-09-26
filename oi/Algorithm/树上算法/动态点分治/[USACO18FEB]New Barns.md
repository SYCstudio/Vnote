# [USACO18FEB]New Barns
[BZOJ5192 Luogu4271]

Farmer John注意到他的奶牛们如果被关得太紧就容易吵架，所以他想开放一些新的牛棚来分散她们。  
每当FJ建造一个新牛棚的时候，他会将这个牛棚用至多一条双向道路与一个现有的牛棚连接起来。为了确保他的奶牛们足够分散，他有时想要确定从某个特定的牛棚出发，到它能够到达的最远的牛棚的距离（两个牛棚之间的距离等于从一个牛棚出发到另一个之间必须经过的道路条数）。  
FJ总共会给出$Q$（$1 \leq Q \leq 10^5$）次请求，每个请求都是“建造”和“距离”之一。对于一个建造请求，FJ建造一个牛棚，并将其与至多一个现有的牛棚连接起来。对于一个距离请求，FJ向你询问从某个特定的牛棚通过一些道路到离它最远的牛棚的距离。保证询问的牛棚已经被建造。请帮助FJ响应所有的请求。

预处理出点分树，每次加一个点则在点分树上跳父亲，对于每一个点维护到其管辖的点分树的最远的点，以及与最远点不在同一子树的次远点，实时维护和更新这两个值。查询的时候则在那些已经存在的点查询。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int maxM=maxN<<1;
const int inf=2147483647;

class Option
{
public:
	char opt;int key;
};

int n,Q;
Option O[maxN];
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int Fa[maxN],Top[maxN],Hs[maxN],Dpt[maxN];
int nowsize,root,Size[maxN],Mx[maxN];
vector<int> Ap[maxN];
bool vis[maxN],mark[maxN];
int A[2][maxN],F[2][maxN];

void Add_Edge(int u,int v);
void dfs1(int u,int fa);
void dfs2(int u,int top);
int LCA(int u,int v);
int Dist(int u,int v);
void dfs_root(int u,int fa);
void Solve(int u);
void dfs_mark(int u,int fa);
void Update(int u);
int Query(int u);

int main(){
	mem(Head,-1);
	scanf("%d",&Q);
	for (int i=1;i<=Q;i++){
		scanf(" %c%d",&O[i].opt,&O[i].key);
		if (O[i].opt=='B'){
			n++;
			if (O[i].key!=-1) Add_Edge(n,O[i].key);
		}
	}

	for (int i=1;i<=n;i++)
		if (Dpt[i]==0){
			Dpt[i]=1;dfs1(i,i);dfs2(i,i);
		}

	for (int i=1;i<=n;i++)
		if (vis[i]==0){
			nowsize=n;Mx[0]=inf;root=0;
			dfs_root(i,i);
			Solve(root);
		}

	int nn=0;
	for (int i=1;i<=Q;i++){
		if (O[i].opt=='B') Update(++nn);
		if (O[i].opt=='Q') printf("%d\n",Query(O[i].key));
	}
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	Next[++edgecnt]=Head[v];Head[v]=edgecnt;V[edgecnt]=u;
	return;
}

void dfs1(int u,int fa){
	Size[u]=1;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			Fa[V[i]]=u;Dpt[V[i]]=Dpt[u]+1;
			dfs1(V[i],u);Size[u]+=Size[V[i]];
			if (Size[V[i]]>Size[Hs[u]]) Hs[u]=V[i];
		}
	return;
}

void dfs2(int u,int top){
	Top[u]=top;
	if (Hs[u]==0) return;
	dfs2(Hs[u],top);
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=Fa[u])&&(V[i]!=Hs[u])) dfs2(V[i],V[i]);
	return;
}

void dfs_root(int u,int fa){
	Size[u]=1;Mx[u]=0;
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=fa)&&(vis[V[i]]==0)){
			dfs_root(V[i],u);
			Size[u]+=Size[V[i]];Mx[u]=max(Mx[u],Size[V[i]]);
		}
	Mx[u]=max(Mx[u],nowsize-Size[u]);
	if (Mx[u]<Mx[root]) root=u;return;
}

int LCA(int u,int v){
	while (Top[u]!=Top[v]){
		if (Dpt[Top[u]]<Dpt[Top[v]]) swap(u,v);
		u=Fa[Top[u]];
	}
	if (Dpt[u]>Dpt[v]) swap(u,v);
	return u;
}

int Dist(int u,int v){
	return Dpt[u]+Dpt[v]-2*Dpt[LCA(u,v)];
}

void Solve(int u){
	vis[u]=1;
	dfs_mark(u,u);dfs_root(u,u);
	for (int i=Head[u];i!=-1;i=Next[i])
		if (vis[V[i]]==0){
			root=0;nowsize=Size[V[i]];
			dfs_root(V[i],V[i]);Solve(root);
		}
	return;
}

void dfs_mark(int u,int fa){
	Ap[u].push_back(root);
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=fa)&&(vis[V[i]]==0))
			dfs_mark(V[i],u);
	return;
}

void Update(int u){
	mark[u]=1;
	for (int i=Ap[u].size()-2;i>=0;i--){
		int anc=Ap[u][i],d=Dist(u,anc);
		if (d>=A[0][anc]){
			if (F[0][anc]!=Ap[u][i+1]){
				F[1][anc]=F[0][anc];A[1][anc]=A[0][anc];
			}
			F[0][anc]=Ap[u][i+1];A[0][anc]=d;
		}
		else if ((d>A[1][anc])&&(F[0][anc]!=Ap[u][i+1])){
			F[1][anc]=Ap[u][i+1];A[1][anc]=d;
		}
	}
	return;
}

int Query(int u){
	int mx=A[0][u];
	for (int i=Ap[u].size()-2;i>=0;i--){
		int anc=Ap[u][i],d=Dist(u,anc);
		if (mark[anc]){
			if (F[0][anc]!=Ap[u][i+1]) mx=max(mx,d+A[0][anc]);
			else mx=max(mx,d+A[1][anc]);
		}
	}
	return mx;
}
```