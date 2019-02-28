# Chef and Sad Pairs
[CC SADPAIRS]

大厨最近为寝室里的 N 名同学搭了一个网络。网络中有 E 对电脑之间直接相连。只要两台电脑间存在一条由直接相连的电脑构成的路径，就能相互通信。  
这 N 名同学都喜欢篮球，但每个人都有各自喜欢的球队。第 i 个人喜欢的球队是 Gi 队。同一支球队的粉丝自然想要在网络上相互交流。但不幸的是，大厨不是很懂电脑，因此他也不确定是不是每两台电脑之间都能相互通信。我们称两个人 i 和 j 是一对悲伤的人，当且仅当他们喜欢的球队相同（即 Gi = Gj），但又无法互相交流。目前网络上可能有许多对悲伤的人。  
更糟的是，随着时间的推移，可能有人从网络中断开，导致更多人无法相互通信。当一个人断线时，所有与他直接相连的连接都无法使用。  
大厨没料到有这么多问题，因此他找到你来帮忙。你的任务就是提交一份报告，包含 N 个整数，其中第 i 个整数代表第 i 个人断线后有多少对悲伤的人。

先把原来就不连通的对求出来，这是在每一次询问中都会涉及到的。  
考虑连通的一对颜色相同的人，它们之间不连通当且仅当中间的某个割点断开，也就是说为圆方树上两个点之间的圆点。问题转化为一个虚树上 DP +差分问题 。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<map>
#include<vector>
#include<iostream>
using namespace std;

typedef long long ll;
#define ft first
#define sd second
const int maxN=201000<<1;
const int maxM=maxN<<1;
const int maxB=20;

int n,m,colcnt,Lg[maxN],idcnt,Col[maxN],bcccnt,Bcc[maxN];
map<int,int> ColMap;
vector<int> Belong[maxN];
int edgecnt=-1,Head[maxN],Next[maxM],V[maxM],Dep[maxN],dfncnt,dfn[maxN],rht[maxN],Fa[maxB][maxN];
ll baseans,Ans[maxN],Sm[maxN];
int Sorter[maxN],Bp[maxN],St[maxN],Sz[maxN];

void Add_Edge(int u,int v);
void dfs_init(int u,int fa);
int LCA(int u,int v);
bool dcmp(int a,int b);
void dfs_sum(int u,int fa);

namespace Graph{
    int edgecnt=-1,Head[maxN],Next[maxM],V[maxM];
    int dfncnt,dfn[maxN],low[maxN],Id[maxN],top,St[maxN];
    map<int,int> C1,C2,E[maxN];
    void Add_Edge(int u,int v);
    void main();
    void tarjan(int u,int fa);
}

int main(){
    scanf("%d%d",&n,&m);memset(Graph::Head,-1,sizeof(Graph::Head));memset(Head,-1,sizeof(Head));idcnt=n;
    for (int i=1;i<=n;i++){
        int col;scanf("%d",&col);if (ColMap.count(col)==0) ColMap[col]=++colcnt;
        Col[i]=ColMap[col];Belong[Col[i]].push_back(i);
    }
    for (int i=1;i<=m;i++){
        int u,v;scanf("%d%d",&u,&v);Graph::Add_Edge(u,v);Graph::Add_Edge(v,u);
    }
    Graph::main();

    for (int i=1;i<=idcnt;i++) if (dfn[i]==0) ++bcccnt,dfs_init(i,0);
    for (int i=1;i<maxB;i++) for (int j=1;j<=idcnt;j++) Fa[i][j]=Fa[i-1][Fa[i-1][j]];

    for (int c=1;c<=colcnt;c++){
        int scnt=Belong[c].size();for (int i=0;i<scnt;i++) Sorter[i+1]=Belong[c][i];
        sort(&Sorter[1],&Sorter[scnt+1],dcmp);
        for (int l=1,r;l<=scnt;l=r+1){
            r=l;while (r<scnt&&Bcc[Sorter[r+1]]==Bcc[Sorter[l]]) ++r;
            int bcnt=0;
            for (int i=l;i<=r;i++) Bp[++bcnt]=Sorter[i];
            for (int i=l;i<r;i++) Bp[++bcnt]=LCA(Sorter[i],Sorter[i+1]);
            sort(&Bp[1],&Bp[bcnt+1],dcmp);bcnt=unique(&Bp[1],&Bp[bcnt+1])-Bp-1;
            int top=0;
            for (int i=1;i<=bcnt;i++){
                while (top>=1&&rht[St[top]]<dfn[Bp[i]]){
                    if (top>1){
                        ll k=1ll*Sz[top]*(r-l+1-Sz[top]);
                        Ans[St[top]]+=k;
                        Sm[Fa[0][St[top]]]+=k;Sm[St[top-1]]-=k;
                        Ans[St[top-1]]+=1ll*Sz[top-1]*Sz[top];
                        Sz[top-1]+=Sz[top];
                    }
                    --top;
                }
                St[++top]=Bp[i];Sz[top]=Col[Bp[i]]==c;
            }
            while (top>1){
                ll k=1ll*Sz[top]*(r-l+1-Sz[top]);
                Ans[St[top]]+=k;
                Sm[Fa[0][St[top]]]+=k;Sm[St[top-1]]-=k;
                Ans[St[top-1]]+=1ll*Sz[top-1]*Sz[top];
                Sz[top-1]+=Sz[top];--top;
            }
        }
    }
    memset(dfn,0,sizeof(dfn));
    for (int i=1;i<=idcnt;i++) if (dfn[i]==0) dfs_sum(i,0);
    for (int i=1;i<=n;i++) printf("%lld\n",Ans[i]+baseans);
    return 0;
}

void Add_Edge(int u,int v){
    Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;return;
}
void dfs_init(int u,int fa){
    Dep[u]=Dep[fa]+1;Fa[0][u]=fa;dfn[u]=++dfncnt;Bcc[u]=bcccnt;
    for (int i=Head[u];i!=-1;i=Next[i]) if (V[i]!=fa) dfs_init(V[i],u);
    rht[u]=dfncnt;return;
}
int LCA(int u,int v){
    if (Dep[u]<Dep[v]) swap(u,v);for (int i=maxB-1;i>=0;i--) if (Fa[i][u]&&Dep[Fa[i][u]]>=Dep[v]) u=Fa[i][u];
    if (u==v) return u;for (int i=maxB-1;i>=0;i--) if (Fa[i][u]&&Fa[i][v]&&Fa[i][u]!=Fa[i][v]) u=Fa[i][u],v=Fa[i][v];
    return Fa[0][u];
}
bool dcmp(int a,int b){
    return dfn[a]<dfn[b];
}
void dfs_sum(int u,int fa){
    dfn[u]=1;
    for (int i=Head[u];i!=-1;i=Next[i]) if (V[i]!=fa) dfs_sum(V[i],u),Sm[u]+=Sm[V[i]];
    Ans[u]+=Sm[u];return;
}

namespace Graph{
    void Add_Edge(int u,int v){
        Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;return;
    }
    void main(){
        C1.clear();
        for (int i=1;i<=n;i++)
            if (dfn[i]==0){
                tarjan(i,0);
                for (map<int,int>::iterator it=C2.begin();it!=C2.end();++it) baseans+=1ll*C1[(*it).ft]*(*it).sd,C1[(*it).ft]+=(*it).sd;
                C2.clear();
            }
        return;
    }
    void tarjan(int u,int fa){
        dfn[u]=low[u]=++dfncnt;++C2[Col[u]];St[++top]=u;
        for (int i=Head[u];i!=-1;i=Next[i])
            if (V[i]!=fa){
                int v=V[i];
                if (dfn[v]==0){
                    tarjan(v,u);low[u]=min(low[u],low[v]);
                    if (low[v]>=dfn[u]){
                        ++idcnt;int p;
                        do p=St[top--],::Add_Edge(idcnt,p),::Add_Edge(p,idcnt);while (p!=v);
                        ::Add_Edge(idcnt,u);::Add_Edge(u,idcnt);
                    }
                }
                else low[u]=min(low[u],dfn[v]);
            }
        return;
    }
}
```