# Tree Mst
[ATCF17J]

给你一棵 n 个节点的树,每个点有权值 w ,边有长度。现构建一张完全图,对于任意一对点(x,y),连一条长度为 w[x] + w[y] + dis(x, y) 的边。求这张图的最小生成树。

考虑点分治，这样就把 dis(x,y) 拆成 d[x]+d[y]。考虑在每一层分治的时候，找一个 w[x]+d[x] 最小的，该层所有点向它连边。最后再跑一个最小生成树。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

typedef long long ll;
const int maxN=202000;
const int maxM=maxN<<1;
const int inf=1000000000;

class Edge{
    public:
    int u,v;ll w;
};

int n,m,ufs[maxN];
int edgecnt=-1,Head[maxN],Next[maxM],V[maxM],W[maxM];
int Sz[maxN],Mx[maxN],rt,rtsize,vis[maxN];
Edge E[maxN*20];
ll Nw[maxN],Val[maxN];

void Add_Edge(int u,int v,int w);
void Divide(int start,int size);
void dfs_root(int u,int fa,int size);
void dfs_calc(int u,int fa,ll dst,int &x);
void dfs_push(int u,int fa,int x);
bool cmp(Edge A,Edge B);
int find(int x);
int main(){
    scanf("%d",&n);memset(Head,-1,sizeof(Head));
    for (int i=1;i<=n;i++) scanf("%lld",&Nw[i]);
    for (int i=1;i<n;i++){
        int u,v,w;scanf("%d%d%d",&u,&v,&w);Add_Edge(u,v,w);Add_Edge(v,u,w);
    }
    Divide(1,n);for (int i=1;i<=n;i++) ufs[i]=i;
    sort(&E[1],&E[m+1],cmp);ll Ans=0;
    for (int i=1;i<=m;i++) if (find(E[i].u)!=find(E[i].v)) Ans+=E[i].w,ufs[find(E[i].u)]=find(E[i].v);
    printf("%lld\n",Ans);return 0;
}
void Add_Edge(int u,int v,int w){
    Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;W[edgecnt]=w;
    return;
}
void Divide(int start,int size){
    rt=0;rtsize=inf;dfs_root(start,start,size);
    int u=rt,mn=u;vis[u]=1;Val[u]=Nw[u];
    dfs_calc(u,0,0,mn);dfs_push(u,0,mn);
    for (int i=Head[u];i!=-1;i=Next[i]) if (!vis[V[i]]) Divide(V[i],Sz[V[i]]>Sz[u]?size-Sz[u]:Sz[V[i]]);
    return;
}
void dfs_root(int u,int fa,int size){
    Sz[u]=1;Mx[u]=0;
    for (int i=Head[u];i!=-1;i=Next[i]) if (!vis[V[i]]&&V[i]!=fa) dfs_root(V[i],u,size),Sz[u]+=Sz[V[i]],Mx[u]=max(Mx[u],Sz[V[i]]);
    Mx[u]=max(Mx[u],size-Sz[u]);
    if (Mx[u]<rtsize) rtsize=Mx[u],rt=u;return;
}
void dfs_calc(int u,int fa,ll dst,int &x){
    Val[u]=Nw[u]+dst;if (Val[u]<Val[x]) x=u;
    for (int i=Head[u];i!=-1;i=Next[i]) if (!vis[V[i]]&&V[i]!=fa) dfs_calc(V[i],u,dst+W[i],x);
    return;
}
void dfs_push(int u,int fa,int x){
    E[++m]=((Edge){u,x,Val[u]+Val[x]});for (int i=Head[u];i!=-1;i=Next[i]) if (!vis[V[i]]&&V[i]!=fa) dfs_push(V[i],u,x);return;
}
bool cmp(Edge A,Edge B){
    return A.w<B.w;
}
int find(int x){
    if (ufs[x]!=x) ufs[x]=find(ufs[x]);
    return ufs[x];
}
```