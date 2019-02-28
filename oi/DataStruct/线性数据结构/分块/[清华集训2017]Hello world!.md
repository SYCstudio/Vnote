# [清华集训2017]Hello world!
[BZOJ5121 Luogu4004]

小 V 有 n 道题，他的题都非常毒瘤，所以关爱选手的 ufozgg 打算削弱这些题。为了逃避削弱，小 V 把他的毒瘤题都藏到了一棵 n 个节点的树里（节点编号从 1 至 n），这棵树上的所有节点与小 V 的所有题一一对应。小 V 的每一道题都有一个毒瘤值，节点 i （表示标号为 i 的树上节点，下同）对应的题的毒瘤值为 ai。  
魔法师小 V 为了保护他的题目，对这棵树施了魔法，这样一来，任何人想要一探这棵树的究竟，都必须在上面做跳跃操作。每一次跳跃操作包含一个起点 s 、一个终点 t 和一个步频 k ，这表示跳跃者会从 s 出发，在树上沿着简单路径多次跳跃到达 t ，每次跳跃，如果从当前点到 t 的最短路长度不超过 k ，那么跳跃者就会直接跳到 t ，否则跳跃者就会沿着最短路跳过恰好 k 条边。  
既然小 V 把题藏在了树里， ufozgg 就不能直接削弱题目了。他就必须在树上跳跃，边跳跃边削弱题目。 ufozgg 每次跳跃经过一个节点（包括起点 s ，当 s = t 的时候也是如此），就会把该节点上的题目的毒瘤值开根并向下取整：即如果他经过了节点 i，他就会使 ai = ⌊ pai⌋。这种操作我们称为削弱操作。  
ufozgg 还会不时地希望知道他对题目的削弱程度。因此，他在一些跳跃操作中会放弃对题目的削弱，转而统计该次跳跃经过节点的题目毒瘤值总和。这种操作我们称为统计操作。  
吃瓜群众绿绿对小 V 的毒瘤题和 ufozgg 的削弱计划常感兴趣。他现在想知道  
ufozgg 每次做统计操作时得到的结果。你能帮帮他吗？

注意到当 k 超过根号时，跳跃的步数不会超过根号，可以暴力处理。否则，一个数最多只会开 log 次根号，对于已经是 1 的数，可以直接跳过。维护根号个向上的链表，当某个数无法再开根时，把链表跳过。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
#include<vector>
#include<iostream>
using namespace std;

typedef long long ll;
const int maxN=50500;
const int maxM=maxN<<1;
const int Block=250;
const int maxB=18;

int n;
ll Val[maxN];
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int Anc[Block][maxN],Fa[maxB][maxN],Dep[maxN],St[maxN];

void Add_Edge(int u,int v);
void dfs_init(int u,int fa);
int LCA(int u,int v);
namespace DepFirst{
    int Mx[maxN],Dst[maxN],Top[maxN],Hb[maxN];
    vector<int> Up[maxN],Down[maxN];
    int main();
    void dfs1(int u,int fa);
    void dfs2(int u,int top);
    int Query(int u,int K);
}
int main(){
    scanf("%d",&n);memset(Head,-1,sizeof(Head));
    for (int i=1;i<=n;i++) scanf("%lld",&Val[i]);
    for (int i=1;i<n;i++){
        int u,v;scanf("%d%d",&u,&v);Add_Edge(u,v);Add_Edge(v,u);
    }
    dfs_init(1,0);
    for (int i=1;i<maxB;i++) for (int j=1;j<=n;j++) Fa[i][j]=Fa[i-1][Fa[i-1][j]];
    DepFirst::main();
    int Q;scanf("%d",&Q);
    while (Q--){
        int opt,s,t,k;scanf("%d%d%d%d",&opt,&s,&t,&k);
        if (s==t){
            if (opt) printf("%lld\n",Val[s]);
            else if (Val[t]>1) Val[s]=floor(sqrt(Val[s]));
            continue;
        }
        int lca=LCA(s,t),d=Dep[s]+Dep[t]-Dep[lca]-Dep[lca];ll sum=0;
        if (d%k){
            if (opt) sum+=Val[t];
            else if (Val[t]>1) Val[t]=floor(sqrt(Val[t]));
            t=DepFirst::Query(t,d%k);
            d-=d%k;
        }
        if (k<Block){
            int lst=0;
            while (Dep[s]>=Dep[lca]){
                int fa=Anc[k][s];
                if (opt){
                    sum+=Val[s];
                    if (Dep[fa]>=Dep[lca]) sum+=(Dep[s]-Dep[fa])/k-1;
                    else if (s!=lca) sum+=(Dep[s]-Dep[lca])/k;
                }
                else if (Val[s]>1) Val[s]=floor(sqrt(Val[s]));
                if (Val[s]==1) if (lst) Anc[k][lst]=fa;else;
                else lst=s;
                s=fa;
            }
            lst=0;
            while (Dep[t]>Dep[lca]){
                int fa=Anc[k][t];
                if (opt){
                    sum+=Val[t];
                    if (Dep[fa]>=Dep[lca]) sum+=(Dep[t]-Dep[fa])/k-1;
                    else sum+=(Dep[t]-Dep[lca]-1)/k;
                }
                else if (Val[t]>1) Val[t]=floor(sqrt(Val[t]));
                if (Val[t]==1) if (lst) Anc[k][lst]=fa;else;
                else lst=t;
                t=fa;
            }
        }
        else{
            while (Dep[s]>=Dep[lca]){
                int fa=DepFirst::Query(s,k);
                if (opt) sum+=Val[s];
                else if (Val[s]>1) Val[s]=floor(sqrt(Val[s]));
                s=fa;
            }
            while (Dep[t]>Dep[lca]){
                int fa=DepFirst::Query(t,k);
                if (opt) sum+=Val[t];
                else if (Val[t]>1) Val[t]=floor(sqrt(Val[t]));
                t=fa;
            }
        }
        if (opt) printf("%lld\n",sum);
    }
    return 0;
}
void Add_Edge(int u,int v){
    Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
    return;
}
void dfs_init(int u,int fa){
    Fa[0][u]=fa;Dep[u]=Dep[fa]+1;St[Dep[u]]=u;
    for (int i=1;i<Block&&Dep[u]-i>=1;i++) Anc[i][u]=St[Dep[u]-i];
    for (int i=Head[u];i!=-1;i=Next[i]) if (V[i]!=fa) dfs_init(V[i],u);
    return;
}
int LCA(int u,int v){
    if (Dep[u]<Dep[v]) swap(u,v);for (int i=maxB-1;i>=0;i--) if (Fa[i][u]&&Dep[Fa[i][u]]>=Dep[v]) u=Fa[i][u];
    if (u==v) return u;for (int i=maxB-1;i>=0;i--) if (Fa[i][u]&&Fa[i][v]&&Fa[i][u]!=Fa[i][v]) u=Fa[i][u],v=Fa[i][v];
    return Fa[0][u];
}
namespace DepFirst{
    int main(){
        for (int i=2;i<maxN;i++) Hb[i]=Hb[i>>1]+1;
        dfs1(1,0);dfs2(1,1);
        for (int i=1;i<=n;i++)
            if (Top[i]==i){
                int len=0;
                for (int now=i;now;now=Mx[now]) Down[i].push_back(now),++len;
                for (int now=i;now&&len;now=Fa[0][now]) Up[i].push_back(now),--len;
            }
        return 0;
    }
    void dfs1(int u,int fa){
        Dst[u]=1;
        for (int i=Head[u];i!=-1;i=Next[i])
            if (V[i]!=fa){
                dfs1(V[i],u);Dst[u]=max(Dst[u],Dst[V[i]]+1);
                if (Dst[V[i]]+1>Dst[Mx[u]]+1) Mx[u]=V[i];
            }
        return;
    }
    void dfs2(int u,int top){
        Top[u]=top;if (Mx[u]) dfs2(Mx[u],top);
        for (int i=Head[u];i!=-1;i=Next[i]) if (V[i]!=Mx[u]&&V[i]!=Fa[0][u]) dfs2(V[i],V[i]);
        return;
    }
    int Query(int u,int k){
        if (Dep[u]<=k) return 0;
        u=Fa[Hb[k]][u];k-=(1<<Hb[k]);
        int t=Top[u];
        if (Dep[u]-Dep[t]>=k) return Down[t][Dep[u]-Dep[t]-k];
        return Up[t][k-(Dep[u]-Dep[t])];
    }
}
```