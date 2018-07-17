# Lomsat gelral
[CF600E]

You are given a rooted tree with root in vertex 1. Each vertex is coloured in some colour.  
Let's call colour c dominating in the subtree of vertex v if there are no other colours that appear in the subtree of vertex v more times than colour c. So it's possible that two or more colours will be dominating in the subtree of some vertex.  
The subtree of vertex v is the vertex v and all other vertices that contains vertex v in each path to the root.  
For each vertex v find the sum of all dominating colours in the subtree of vertex v.

每一个点有一个颜色，颜色有编号，现在要求每个子树中出现次数最多的颜色的编号之和。

$dsu\ on\ tree$，每次计算的时候，加上当前贡献，算完后再减去。继承重儿子的答案。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int maxM=maxN*2;
const int inf=2147483647;

int n;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int top=0,Col[maxN],Cnt[maxN];
ll Sum[maxN],Ans[maxN];
int Size[maxN],Hson[maxN];
bool vis[maxN];

void Add_Edge(int u,int v);
void dfs1(int u,int fa);
void dfs2(int u,int fa,int hson);
void Update(int u,int fa,int opt);

int main()
{
	mem(Head,-1);
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&Col[i]);
	for (int i=1;i<n;i++)
	{
		int u,v;scanf("%d%d",&u,&v);
		Add_Edge(u,v);Add_Edge(v,u);
	}

	dfs1(1,0);
	dfs2(1,0,1);
	for (int i=1;i<=n;i++) printf("%lld ",Ans[i]);printf("\n");
	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs1(int u,int fa){
	Size[u]=1;Hson[u]=0;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa)
		{
			dfs1(V[i],u);
			Size[u]+=Size[V[i]];
			if (Size[Hson[u]]<Size[V[i]]) Hson[u]=V[i];
		}
	return;
}

void dfs2(int u,int fa,int hson){
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=fa)&&(V[i]!=Hson[u]))
			dfs2(V[i],u,0);
	if (Hson[u]){
		dfs2(Hson[u],u,1);vis[Hson[u]]=1;
	}
	Update(u,fa,1);vis[Hson[u]]=0;
	Ans[u]=Sum[top];
	if (hson==0) Update(u,fa,-1);
}

void Update(int u,int fa,int opt)
{
	Sum[Cnt[Col[u]]]-=1ll*Col[u];
	Cnt[Col[u]]+=opt;
	Sum[Cnt[Col[u]]]+=1ll*Col[u];
	if (Sum[top+1]) top++;
	if (Sum[top]==0) top--;
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=fa)&&(vis[V[i]]==0))
			Update(V[i],u,opt);
	return;
}
```