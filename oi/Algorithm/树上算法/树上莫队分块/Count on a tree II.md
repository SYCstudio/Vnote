# Count on a tree II
[SPOJ COT2]

给定一个n个节点的树，每个节点表示一个整数，问u到v的路径上有多少个不同的整数。

树上分块后，直接上莫队。翻转两条链，不算$lca$，最后算答案的时候再把$lca$加回来。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=40100;
const int maxM=maxN<<1;
const int maxQ=101000;
const int maxBit=16;
const int inf=2147483647;

class Question
{
public:
	int u,v,id;
};

int n,Q,nowans;
int numcnt,Num[maxN],Val[maxN],Cnt[maxN],Ans[maxN];
int edgecnt=-1,Head[maxN],Next[maxM],V[maxM];
int blocksize,blockcnt=0,Belong[maxN];
int top,St[maxN];
int Fa[maxBit][maxN],Depth[maxN];
Question Qs[maxQ];
bool vis[maxN];

void Add_Edge(int u,int v);
void dfs(int u,int fa);
bool cmp(Question A,Question B);
int LCA(int u,int v);
void Move(int u,int v);
void Reverse(int u);

int main()
{
	mem(Head,-1);
	scanf("%d%d",&n,&Q);blocksize=sqrt(n);
	for (int i=1;i<=n;i++) scanf("%d",&Val[i]),Num[i]=Val[i];
	sort(&Num[1],&Num[n+1]);numcnt=unique(&Num[1],&Num[n+1])-Num-1;
	for (int i=1;i<=n;i++) Val[i]=lower_bound(&Num[1],&Num[n+1],Val[i])-Num;

	for (int i=1;i<n;i++)
	{
		int u,v;scanf("%d%d",&u,&v);
		Add_Edge(u,v);
	}

	dfs(1,0);
	while(top) Belong[St[top--]]=blockcnt;

	for (int i=1;i<maxBit;i++) for (int j=1;j<=n;j++) Fa[i][j]=Fa[i-1][Fa[i-1][j]];

	for (int i=1;i<=Q;i++)
	{
		scanf("%d%d",&Qs[i].u,&Qs[i].v);Qs[i].id=i;
		if (Belong[Qs[i].u]<Belong[Qs[i].v]) swap(Qs[i].u,Qs[i].v);
	}

	sort(&Qs[1],&Qs[Q+1],cmp);
	int nu=1,nv=1;

	for (int i=1;i<=Q;i++)
	{
		Move(nu,Qs[i].u);Move(nv,Qs[i].v);
		nu=Qs[i].u;nv=Qs[i].v;
		int lca=LCA(nu,nv);
		Reverse(lca);
		Ans[Qs[i].id]=nowans;
		Reverse(lca);
	}

	for (int i=1;i<=Q;i++) printf("%d\n",Ans[i]);

	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	Next[++edgecnt]=Head[v];Head[v]=edgecnt;V[edgecnt]=u;
	return;
}

void dfs(int u,int fa){
	int nowtop=top;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			Fa[0][V[i]]=u;Depth[V[i]]=Depth[u]+1;
			dfs(V[i],u);
			if (top-nowtop>=blocksize)
			{
				blockcnt++;
				while (top!=nowtop) Belong[St[top--]]=blockcnt;
			}
		}
	St[++top]=u;return;
}

bool cmp(Question A,Question B){
	if (Belong[A.u]==Belong[B.u]) return Belong[A.v]<Belong[B.v];
	else return Belong[A.u]<Belong[B.u];
}

int LCA(int u,int v)
{
	if (Depth[u]<Depth[v]) swap(u,v);
	for (int i=maxBit-1;i>=0;i--) if ((Fa[i][u])&&(Depth[Fa[i][u]]>=Depth[v])) u=Fa[i][u];
	if (u==v) return u;
	for (int i=maxBit-1;i>=0;i--) if ((Fa[i][u])&&(Fa[i][v])&&(Fa[i][u]!=Fa[i][v])) u=Fa[i][u],v=Fa[i][v];
	return Fa[0][u];
}

void Move(int u,int v)
{
	int lca=LCA(u,v);
	while (u!=lca) Reverse(u),u=Fa[0][u];
	while (v!=lca) Reverse(v),v=Fa[0][v];
	return;
}

void Reverse(int u)
{
	if (vis[u]){
		Cnt[Val[u]]--;
		if (Cnt[Val[u]]==0) nowans--;
	}
	else{
		Cnt[Val[u]]++;
		if (Cnt[Val[u]]==1) nowans++;
	}
	vis[u]^=1;
	return;
}
```