# Querying on a Grid
[CC QGRID]

见附件。

既然行数量只有 3 ，考虑以此为突破点。  
对于网格图上的最短路，假设枚举一个分割点，那么就可以计算经过这个分割点的所有最短路。考虑分治，每次对区间维护从中线 m 个点为根的最短路树，查询的时候直接查询所有包含区间的最短路最小值，找出来后暴力对树上链做标记。直接做标记复杂度需要套一个树链剖分，把它转化成单点修改+子树权值和的查询即可。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<queue>
#include<iostream>
using namespace std;

typedef long long ll;
#define ft first
#define sd second
#define mp make_pair
const int maxN=101000;
const int maxM=4;
const ll INF=(1e18)+10;

class BIT{
    public:
    int sz;ll B[maxN*3];
    void Init(int n){
        sz=n;return;
    }
    void Add(int p,ll k){
        if (p==0) return;
        while (p<=sz) B[p]+=k,p+=(p)&(-p);return;
    }
    ll Sum(int p){
        ll ret=0;while (p) ret+=B[p],p-=(p)&(-p);return ret;
    }
    ll Query(int l,int r){
        return Sum(r)-Sum(l-1);
    }
};
class SData{
    public:
    int dfncnt,dfn[maxN*3],rht[maxN*3],rt[maxN*3];
    int edgecnt,Hd[maxN*3],Nt[maxN*3],V[maxN*3];
    ll D[maxN*3];BIT B;
    void Init(int n){
        edgecnt=-1;memset(Hd,-1,sizeof(Hd));B.Init(n);return;
    }
    void Add_Edge(int u,int v){
        Nt[++edgecnt]=Hd[u];Hd[u]=edgecnt;V[edgecnt]=v;return;
    }
    void dfs(int u,int fa){
        if (u==fa) rt[u]=u;else rt[u]=rt[fa];
        dfn[u]=++dfncnt;for (int i=Hd[u];i!=-1;i=Nt[i]) if (V[i]!=fa) dfs(V[i],u);
        rht[u]=dfncnt;return;
    }
    void Plus(int u,int v,ll c){
        B.Add(dfn[u],c),B.Add(dfn[v],c);B.Add(dfn[rt[u]],-c);return;
    }
    ll Query(int x){
        return B.Query(dfn[x],rht[x]);
    }
};

int n,m,Q,Id[maxM][maxN],top=0,From[maxM][maxN];
ll Down[maxM][maxN],Right[maxM][maxN],D[maxM][maxN],ST[20][3];
bool vis[maxM][maxN];
SData S[20][3];
priority_queue<pair<ll,pair<int,int > > > H;

void Divide(int d,int l,int r);
void Modify(int d,int l,int r,int ql,int qr,int u,int v);
ll Query(int d,int l,int r,int p,int u);

int main(){
    scanf("%d%d%d",&m,&n,&Q);
    for (int i=1,idcnt=0;i<=m;i++) for (int j=1;j<=n;j++) Id[i][j]=++idcnt;
    for (int i=1;i<m;i++) for (int j=1;j<=n;j++) scanf("%lld",&Down[i][j]);
    for (int i=1;i<=m;i++) for (int j=1;j<n;j++) scanf("%lld",&Right[i][j]);
    for (int i=0;i<20;i++) for (int j=0;j<3;j++) S[i][j].Init(n*m);
    Divide(0,1,n);
    while (Q--){
        int opt;scanf("%d",&opt);
        if (opt==1){
            int x1,y1,x2,y2;ll c;scanf("%d%d%d%d%lld",&x1,&y1,&x2,&y2,&c);
            if (y1>y2) swap(y1,y2),swap(x1,x2);
            int u=Id[x1][y1],v=Id[x2][y2];top=0;
            Modify(0,1,n,y1,y2,u,v);ll mn=INF;bool flag=1;
            for (int i=0;i<=top;i++) for (int j=0;j<m;j++) mn=min(mn,ST[i][j]);
            for (int i=0;i<=top&&flag;i++)
                for (int j=0;j<m&&flag;j++)
                    if (ST[i][j]==mn){
                        S[i][j].Plus(u,v,c);flag=0;
                    }
        }
        else{
            int x,y;scanf("%d%d",&x,&y);int u=Id[x][y];
            printf("%lld\n",Query(0,1,n,y,u));
        }
    }
    return 0;
}
void Divide(int d,int l,int r){
    int mid=(l+r)>>1;
    for (int p=1;p<=m;p++){
        for (int i=1;i<=m;i++) for (int j=l;j<=r;j++) D[i][j]=INF,vis[i][j]=0;while (!H.empty()) H.pop();
        D[p][mid]=0;H.push(mp(0ll,mp(p,mid)));From[p][mid]=-1;
        while (!H.empty()){
            int x=H.top().sd.ft,y=H.top().sd.sd;H.pop();
            if (vis[x][y]) continue;vis[x][y]=1;
            if (x!=1) if (D[x][y]+Down[x-1][y]<D[x-1][y]) H.push(mp(-(D[x-1][y]=D[x][y]+Down[x-1][y]),mp(x-1,y))),From[x-1][y]=0;
            if (y<r) if (D[x][y]+Right[x][y]<D[x][y+1]) H.push(mp(-(D[x][y+1]=D[x][y]+Right[x][y]),mp(x,y+1))),From[x][y+1]=1;
            if (x!=m) if (D[x][y]+Down[x][y]<D[x+1][y]) H.push(mp(-(D[x+1][y]=D[x][y]+Down[x][y]),mp(x+1,y))),From[x+1][y]=2;
            if (y>l) if (D[x][y]+Right[x][y-1]<D[x][y-1]) H.push(mp(-(D[x][y-1]=D[x][y]+Right[x][y-1]),mp(x,y-1))),From[x][y-1]=3;
        }
        for (int i=1;i<=m;i++)
            for (int j=l;j<=r;j++)
                if (From[i][j]==0) S[d][p-1].Add_Edge(Id[i+1][j],Id[i][j]);
                else if (From[i][j]==1) S[d][p-1].Add_Edge(Id[i][j-1],Id[i][j]);
                else if (From[i][j]==2) S[d][p-1].Add_Edge(Id[i-1][j],Id[i][j]);
                else if (From[i][j]==3) S[d][p-1].Add_Edge(Id[i][j+1],Id[i][j]);
        for (int i=1;i<=m;i++) for (int j=l;j<=r;j++) S[d][p-1].D[Id[i][j]]=D[i][j];
        S[d][p-1].dfs(Id[p][mid],Id[p][mid]);
    }
    if (l==r) return;
    Divide(d+1,l,mid);Divide(d+1,mid+1,r);return;
}
    int mid=(l+r)>>1;top=d;
    for (int i=0;i<m;i++) ST[d][i]=S[d][i].D[u]+S[d][i].D[v];
    if (l==r) return;
    if (qr<=mid) Modify(d+1,l,mid,ql,qr,u,v);
    else if (ql>=mid+1) Modify(d+1,mid+1,r,ql,qr,u,v);
    return;
}
ll Query(int d,int l,int r,int p,int u){
    ll ret=0;for (int i=0;i<m;i++) ret+=S[d][i].Query(u);
    if (l==r) return ret;int mid=(l+r)>>1;
    if (p<=mid) return ret+Query(d+1,l,mid,p,u);
    else return ret+Query(d+1,mid+1,r,p,u);
}
```