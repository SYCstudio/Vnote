# [WC2016]挑战NPC
[UOJ171 BZOJ4405 Luogu4258]

小 N 最近在研究 NP 完全问题，小 O 看小 N 研究得热火朝天，便给他出了一道这样的题目：  
有 $n$ 个球，用整数 $1$ 到 $n$ 编号。还有 $m$ 个筐子，用整数 $1$ 到 $m$ 编号。  
每个筐子最多能装 3 个球。  
每个球只能放进特定的筐子中。具体有 $e$ 个条件，第 $i$ 个条件用两个整数 $v_i$ 和 $u_i$ 描述，表示编号为 $v_i$ 的球可以放进编号为 $u_i$ 的筐子中。  
每个球都必须放进一个筐子中。如果一个筐子内有不超过 $1$ 个球，那么我们称这样的筐子为半空的。  
求半空的筐子最多有多少个，以及在最优方案中，每个球分别放在哪个筐子中。  
小 N 看到题目后瞬间没了思路，站在旁边看热闹的小 I 嘿嘿一笑：“水题！”  
然后三言两语道出了一个多项式算法。  
小 N 瞬间就惊呆了，三秒钟后他回过神来一拍桌子：  
“不对！这个问题显然是 NP 完全问题，你算法肯定有错！”  
小 I 浅笑：“所以，等我领图灵奖吧!”  
小 O 只会出题不会做题，所以找到了你——请你对这个问题进行探究，并写一个程序解决此题。

注意到这个奇妙的代价计算方式。构造一个筐子三个点，筐子的三个点之间互相连边。每一个球一个点。如果编号为 $v _ i$ 的球可以放进编号为 $u _ i$ 的筐子中，那么把球与对应的三个点均连边。这样构图使得最大匹配恰好就是答案。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
const int maxN=710;
const int maxM=maxN*maxN*2;

int n,m,E;
int edgecnt=-1,Head[maxN],Next[maxM],V[maxM];
int match[maxN],pre[maxN],tim,Tim[maxN],ql,qr,Qu[maxN],ufs[maxN],label[maxN];

void Add_Edge(int u,int v);
int find(int x);
int bfs(int S);
int LCA(int u,int v);
void Push(int u,int v,int lca);
int main(){
    int Case;scanf("%d",&Case);
    while (Case--){
        mem(Head,-1);edgecnt=-1;mem(match,0);
        scanf("%d%d%d",&n,&m,&E);
        for (int i=1;i<=E;i++){
            int u,v;scanf("%d%d",&u,&v);
            Add_Edge(u,n+v);Add_Edge(u,n+m+v);Add_Edge(u,n+m+m+v);
        }
        for (int i=1;i<=m;i++) Add_Edge(i+n,i+n+m),Add_Edge(i+n+m,i+n+m+m),Add_Edge(i+n+m+m,i+n);
        int Ans=0;
        for (int i=1;i<=n+m+m+m;i++) if (!match[i]) Ans+=bfs(i);
        printf("%d\n",Ans-n);
        for (int i=1;i<=n;i++) printf("%d ",(match[i]-n-1)%m+1);printf("\n");
    }
    return 0;
}
void Add_Edge(int u,int v){
    Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
    Next[++edgecnt]=Head[v];Head[v]=edgecnt;V[edgecnt]=u;
    return;
}
int find(int x){
    if (ufs[x]!=x) ufs[x]=find(ufs[x]);
    return ufs[x];
}
int bfs(int S){
    for (int i=1;i<=n+m+m+m;i++) ufs[i]=i,pre[i]=label[i]=0;
    label[Qu[ql=qr=1]=S]=1;
    while (ql<=qr)
        for (int u=Qu[ql++],i=Head[u];i!=-1;i=Next[i]){
            if (find(V[i])==find(u)||label[V[i]]==2) continue;
            int v=V[i];
            if (!label[v]){
                if (!match[v]){
                    int now=u,lst=v;
                    while (now){
                        int tmp=match[now];
                        match[now]=lst;match[lst]=now;
                        lst=tmp;now=pre[lst];
                    }
                    return 1;
                }
                label[v]=2;label[match[v]]=1;
                Qu[++qr]=match[v];pre[v]=u;
            }
            else{
                int lca=LCA(u,v);Push(u,v,lca);Push(v,u,lca);
            }
        }
    return 0;
}
int LCA(int u,int v){
    u=find(u);v=find(v);++tim;
    while (Tim[u]!=tim){
        Tim[u]=tim;u=find(pre[match[u]]);
        if (v) swap(u,v);
    }
    return u;
}
void Push(int x,int y,int lca){
    while (find(x)!=lca){
        pre[x]=y;y=match[x];
        if (label[y]==2) Qu[++qr]=y,label[y]=1;
        if (find(x)==x) ufs[x]=lca;
        if (find(y)==y) ufs[y]=lca;
        x=pre[y];
    }
    return;
}
```