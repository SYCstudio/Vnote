# Tree Requests
[CF570D]

Roman planted a tree consisting of n vertices. Each vertex contains a lowercase English letter. Vertex 1 is the root of the tree, each of the n - 1 remaining vertices has a parent in the tree. Vertex is connected with its parent by an edge. The parent of vertex i is vertex pi, the parent index is always less than the index of the vertex (i.e., pi < i).  
The depth of the vertex is the number of nodes on the path from the root to v along the edges. In particular, the depth of the root is equal to 1.  
We say that vertex u is in the subtree of vertex v, if we can get from u to v, moving from the vertex to the parent. In particular, vertex v is in its subtree.  
Roma gives you m queries, the i-th of which consists of two numbers vi, hi. Let's consider the vertices in the subtree vi located at depth hi. Determine whether you can use the letters written at these vertices to make a string that is a palindrome. The letters that are written in the vertexes, can be rearranged in any order to make a palindrome, but all letters should be used.

给定一棵有根树，每一个点上有一个字符，现在每次询问在一个点的子树内，一定深度的所有点的字符能否通过重排组成回文串。

能够构成回文串，即二进制表示字符后，最多只会有一个字符出现奇数次，异或起来即最多只有一个$1$。把询问离线下来，然后$dsu\ on\ tree$

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

const int maxN=501000;
const int maxM=maxN<<1;
const int inf=2147483647;

class Question
{
public:
	int depth,id;
};

int n,Q;
char Val[maxN];
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int Depth[maxN],Hson[maxN],Size[maxN],Id[maxN];
int dfncnt,fst[maxN],lst[maxN],Sum[maxN];
vector<Question> T[maxN];
int Ans[maxN];

void Add_Edge(int u,int v);
void dfs1(int u);
void dfs2(int u,int hson);

int main()
{
	mem(Head,-1);
	scanf("%d%d",&n,&Q);
	for (int i=2;i<=n;i++)
	{
		int fa;scanf("%d",&fa);
		Add_Edge(fa,i);
	}
	scanf("%s",Val+1);
	for (int i=1;i<=Q;i++)
	{
		int u,depth;scanf("%d%d",&u,&depth);
		T[u].push_back((Question){depth,i});
	}

	Depth[1]=1;
	dfs1(1);
	dfs2(1,1);

	for (int i=1;i<=Q;i++)
		if (Ans[i]) printf("Yes\n");
		else printf("No\n");
	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs1(int u)
{
	Id[fst[u]=++dfncnt]=u;Size[u]=1;
	for (int i=Head[u];i!=-1;i=Next[i])
	{
		Depth[V[i]]=Depth[u]+1;
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

	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=Hson[u])
		{
			int v=V[i];
			for (int j=fst[v];j<=lst[v];j++)
				Sum[Depth[Id[j]]]^=(1<<(Val[Id[j]]-'a'));
		}
	Sum[Depth[u]]^=(1<<(Val[u]-'a'));
	int sz=T[u].size();
	for (int i=0;i<sz;i++)
	{
		int key=Sum[T[u][i].depth];
		int cnt=0;
		while (key) cnt+=(key&1),key>>=1;
		if (cnt<=1) Ans[T[u][i].id]=1;
		else Ans[T[u][i].id]=0;
	}
	if (hson==0) for (int i=fst[u];i<=lst[u];i++) Sum[Depth[Id[i]]]=0;
	return;
}
```