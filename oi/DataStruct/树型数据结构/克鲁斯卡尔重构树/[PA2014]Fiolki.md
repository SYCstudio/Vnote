# [PA2014]Fiolki
[BZOJ3712]

化学家吉丽想要配置一种神奇的药水来拯救世界。  
吉丽有n种不同的液体物质，和n个药瓶（均从1到n编号）。初始时，第i个瓶内装着g[i]克的第i种物质。吉丽需要执行一定的步骤来配置药水，第i个步骤是将第a[i]个瓶子内的所有液体倒入第b[i]个瓶子，此后第a[i]个瓶子不会再被用到。瓶子的容量可以视作是无限的。  
吉丽知道某几对液体物质在一起时会发生反应产生沉淀，具体反应是1克c[i]物质和1克d[i]物质生成2克沉淀，一直进行直到某一反应物耗尽。生成的沉淀不会和任何物质反应。当有多于一对可以发生反应的物质在一起时，吉丽知道它们的反应顺序。每次倾倒完后，吉丽会等到反应结束后再执行下一步骤。  
吉丽想知道配置过程中总共产生多少沉淀。

对合并过程建立克鲁斯卡尔重构树，把每一对反应放到它们的 lca 上，最后一遍一起处理。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
using namespace std;

typedef long long ll;
const int maxN=502000;
const int maxB=20;

int n,m,K,ncnt;
int Cnt[maxN],ufs[maxN],Fa[maxB][maxN],Dep[maxN];
pair<int,int> Rct[maxN];
vector<int> Ctr[maxN];

int find(int x);
int LCA(int u,int v);
int main(){
    scanf("%d%d%d",&n,&m,&K);ncnt=n;for (int i=1;i<=n;i++) scanf("%d",&Cnt[i]),ufs[i]=i;
    for (int i=1;i<=m;i++){
        int u,v;scanf("%d%d",&u,&v);u=find(u);v=find(v);
        ++ncnt;Fa[0][u]=Fa[0][v]=ufs[u]=ufs[v]=ufs[ncnt]=ncnt;
    }
    for (int i=ncnt;i>=1;i--) Dep[i]=Dep[Fa[0][i]]+1;
    for (int i=1;i<maxB;i++) for (int j=1;j<=ncnt;j++) Fa[i][j]=Fa[i-1][Fa[i-1][j]];
    for (int i=1;i<=K;i++){
        int u,v;scanf("%d%d",&u,&v);int lca=LCA(u,v);
        Rct[i]=make_pair(u,v);Ctr[lca].push_back(i);
    }
    ll Ans=0;
    for (int i=1;i<=ncnt;i++)
        for (int j=0,sz=Ctr[i].size();j<sz;j++){
            int p=Ctr[i][j],mn=min(Cnt[Rct[p].first],Cnt[Rct[p].second]);
            Ans=Ans+mn+mn;
            Cnt[Rct[p].first]-=mn;Cnt[Rct[p].second]-=mn;
        }
    printf("%lld\n",Ans);return 0;
}
int find(int x){
    if (ufs[x]!=x) ufs[x]=find(ufs[x]);
    return ufs[x];
}
int LCA(int u,int v){
    if (Dep[u]<Dep[v]) swap(u,v);for (int i=maxB-1;i>=0;i--) if (Fa[i][u]&&Dep[Fa[i][u]]>=Dep[v]) u=Fa[i][u];
    if (u==v) return u;
    for (int i=maxB-1;i>=0;i--) if (Fa[i][u]&&Fa[i][v]&&Fa[i][u]!=Fa[i][v]) u=Fa[i][u],v=Fa[i][v];
    return Fa[0][u];
}
```