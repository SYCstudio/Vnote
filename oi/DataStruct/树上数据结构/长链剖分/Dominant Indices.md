# Dominant Indices
[CF1009F]

给出一棵有根树，对于每一个点，统计其子树内，与它距离相同的点最多的距离，如果有多个，输出最浅的。

长链剖分，实时维护最大值。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010000;
const int maxM=maxN<<1;
const int inf=2147483647;

int n;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int MxD[maxN],Hson[maxN],dfncnt,dfn[maxN],Fa[maxN];
int F[maxN],Ans[maxN];

void Add_Edge(int u,int v);
void dfs1(int u);
void dfs2(int u,int top);
void dp(int u);

int main(){
	mem(Head,-1);
	scanf("%d",&n);
	for (int i=1;i<n;i++){
		int u,v;scanf("%d%d",&u,&v);
		Add_Edge(u,v);Add_Edge(v,u);
	}

	dfs1(1);dfs2(1,1);

	dp(1);

	for (int i=1;i<=n;i++) printf("%d\n",Ans[i]);

	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs1(int u){
	MxD[u]=0;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=Fa[u]){
			Fa[V[i]]=u;dfs1(V[i]);
			if (MxD[V[i]]+1>MxD[u]) MxD[u]=MxD[V[i]]+1,Hson[u]=V[i];
		}
	return;
}

void dfs2(int u,int top){
	dfn[u]=++dfncnt;
	if (Hson[u]==0) return;
	dfs2(Hson[u],top);
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=Fa[u])&&(V[i]!=Hson[u]))
			dfs2(V[i],V[i]);
	return;
}

void dp(int u){
	int fu=dfn[u];F[fu]++;Ans[u]=0;
	if (Hson[u]){
		dp(Hson[u]);
		Ans[u]=Ans[Hson[u]]+1;
		for (int i=Head[u];i!=-1;i=Next[i])
			if ((V[i]!=Hson[u])&&(V[i]!=Fa[u])){
				int v=V[i],fv=dfn[v],len=MxD[v];
				dp(V[i]);
				for (int j=0;j<=len;j++){
					F[fu+j+1]+=F[fv+j];
					if ( (F[fu+j+1]>F[fu+Ans[u]]) || ((F[fu+j+1]==F[fu+Ans[u]])&&(Ans[u]>j+1))) Ans[u]=j+1;
				}
			}
	}
	if (F[fu]==F[fu+Ans[u]]) Ans[u]=0;
	return;
}
```