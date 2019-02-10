# Blood Cousins
[CF208E]

Polycarpus got hold of a family relationship tree. The tree describes family relationships of n people, numbered 1 through n. Each person in the tree has no more than one parent.  
Let's call person a a 1-ancestor of person b, if a is the parent of b.  
Let's call person a a k-ancestor (k > 1) of person b, if person b has a 1-ancestor, and a is a (k - 1)-ancestor of b's 1-ancestor.  
Family relationships don't form cycles in the found tree. In other words, there is no person who is his own ancestor, directly or indirectly (that is, who is an x-ancestor for himself, for some x, x > 0).  
Let's call two people x and y (x ≠ y) p-th cousins (p > 0), if there is person z, who is a p-ancestor of x and a p-ancestor of y.  
Polycarpus wonders how many counsins and what kinds of them everybody has. He took a piece of paper and wrote m pairs of integers vi, pi. Help him to calculate the number of pi-th cousins that person vi has, for each pair vi, pi.

给定一个森林，每一次询问一个点的$k$级祖先有几个与它同层的子孙。

倍增跳到$k$级祖先，问题转化为询问这个祖先的子树中深度与该点相同的点的数量，离线下来然后$dsu\ on\ tree$

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

const int maxN=201000;
const int maxM=maxN<<1;
const int maxBit=20;
const int inf=2147483647;

class Question
{
public:
	int depth,id;
};

int n,Q;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int Size[maxN],Depth[maxN],Hson[maxN],Fa[maxBit][maxN];
int dfncnt,fst[maxN],lst[maxN],Id[maxN],Sum[maxN],Ans[maxN];
vector<Question> T[maxN];
vector<int> Rt;

void Add_Edge(int u,int v);
void dfs1(int u);
void dfs2(int u,int hson);

int main()
{
	mem(Head,-1);
	scanf("%d",&n);
	for (int i=1;i<=n;i++)
	{
		int fa;scanf("%d",&fa);
		if (fa!=0) Add_Edge(fa,i);
		else Rt.push_back(i);
	}

	int rsize=Rt.size();
	for (int i=0;i<rsize;i++)
	{
		Depth[Rt[i]]=1;
		dfs1(Rt[i]);
	}
	
	for (int i=1;i<maxBit;i++)
		for (int j=1;j<=n;j++)
			if (Fa[i-1][j]) 
				Fa[i][j]=Fa[i-1][Fa[i-1][j]];

	scanf("%d",&Q);
	for (int i=1;i<=Q;i++)
	{
		int u,k;scanf("%d%d",&u,&k);
		int d=Depth[u];
		for (int j=maxBit-1;j>=0;j--)
			if (k&(1<<j)) u=Fa[j][u];
		T[u].push_back((Question){d,i});
	}

	for (int i=0;i<rsize;i++){
		dfs2(Rt[i],1);
		for (int j=fst[Rt[i]];j<=lst[Rt[i]];j++)
			Sum[Depth[Id[j]]]--;
	}

	for (int i=1;i<=Q;i++) printf("%d ",Ans[i]);printf("\n");
	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs1(int u)
{
	Size[u]=1;Id[fst[u]=++dfncnt]=u;
	for (int i=Head[u];i!=-1;i=Next[i])
	{
		Depth[V[i]]=Depth[u]+1;Fa[0][V[i]]=u;
		dfs1(V[i]);
		Size[u]+=Size[V[i]];
		if (Size[Hson[u]]<Size[V[i]]) Hson[u]=V[i];
	}
	lst[u]=dfncnt;
	return;
}

void dfs2(int u,int hson)
{
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=Hson[u]) dfs2(V[i],0);
	if (Hson[u]) dfs2(Hson[u],1);

	Sum[Depth[u]]++;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=Hson[u])
		{
			int v=V[i];
			for (int j=fst[v];j<=lst[v];j++)
				Sum[Depth[Id[j]]]++;
		}

	int sz=T[u].size();
	for (int i=0;i<sz;i++) Ans[T[u][i].id]=Sum[T[u][i].depth]-1;
	if (hson==0) for (int i=fst[u];i<=lst[u];i++) Sum[Depth[Id[i]]]--;
	return;
}
```