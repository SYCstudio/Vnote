# Tree and Queries
[CF375D]

You have a rooted tree consisting of n vertices. Each vertex of the tree has some color. We will assume that the tree vertices are numbered by integers from 1 to n. Then we represent the color of vertex v as cv. The tree root is a vertex with number 1.  
In this problem you need to answer to m queries. Each query is described by two integers vj, kj. The answer to query vj, kj is the number of such colors of vertices x, that the subtree of vertex vj contains at least kj vertices of color x.  
You can find the definition of a rooted tree by the following link: http://en.wikipedia.org/wiki/Tree_(graph_theory).

给出一棵有根树，每一个点有颜色，每次询问在一个点的子树内，出现次数超过$k$的颜色有多少种。

离线下来然后$dsu\ on\ tree$，注意判断询问大于$n$的情况。

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
#define lowbit(x) ((x)&(-x))

const int maxN=101000;
const int maxM=maxN<<1;
const int inf=2147483647;

class Question
{
public:
	int k,id;
};

int n,Q;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM],Col[maxN];
int Depth[maxN],Size[maxN],Hson[maxN],dfncnt,fst[maxN],lst[maxN],Id[maxN];
int BIT[maxN],Cnt[maxN],Ans[maxN];
vector<Question> T[maxN];

void Add_Edge(int u,int v);
void dfs1(int u,int fa);
void dfs2(int u,int fa,int hson);
void Modify(int col,int opt);
int Query(int pos);
void Add(int pos,int opt);
int Sum(int pos);

int main()
{
	mem(Head,-1);
	scanf("%d%d",&n,&Q);
	for (int i=1;i<=n;i++) scanf("%d",&Col[i]);
	for (int i=1;i<n;i++)
	{
		int u,v;scanf("%d%d",&u,&v);
		Add_Edge(u,v);Add_Edge(v,u);
	}

	for (int i=1;i<=Q;i++)
	{
		int v,k;scanf("%d%d",&v,&k);
		T[v].push_back((Question){k,i});
	}

	Depth[1]=1;
	dfs1(1,1);
	dfs2(1,1,1);

	for (int i=1;i<=Q;i++) printf("%d\n",Ans[i]);
	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs1(int u,int fa)
{
	Size[u]=1;Id[fst[u]=++dfncnt]=u;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			Depth[V[i]]=Depth[u]+1;
			dfs1(V[i],u);Size[u]+=Size[V[i]];
			if (Size[Hson[u]]<Size[V[i]]) Hson[u]=V[i];
		}
	lst[u]=dfncnt;
	return;
}

void dfs2(int u,int fa,int hson)
{
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=fa)&&(V[i]!=Hson[u])) dfs2(V[i],u,0);
	if (Hson[u]) dfs2(Hson[u],u,1);

	Modify(Col[u],1);
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=fa)&&(V[i]!=Hson[u]))
			for (int j=fst[V[i]];j<=lst[V[i]];j++)
				Modify(Col[Id[j]],1);

	int sz=T[u].size();
	for (int i=0;i<sz;i++) Ans[T[u][i].id]=Query(T[u][i].k);
	if (hson==0) for (int i=fst[u];i<=lst[u];i++) Modify(Col[Id[i]],-1);
	return;
}

void Modify(int col,int opt)
{
	if (Cnt[col]) Add(Cnt[col],-1);
	Cnt[col]+=opt;
	if (Cnt[col]) Add(Cnt[col],1);
	return;
}

int Query(int k){
	if (k>n) return 0;
	return Sum(n)-Sum(k-1);
}

void Add(int pos,int key){
	while (pos<=n){
		BIT[pos]+=key;pos+=lowbit(pos);
	}
	return;
}

int Sum(int pos){
	int ret=0;
	while (pos){
		ret+=BIT[pos];pos-=lowbit(pos);
	}
	return ret;
}
```