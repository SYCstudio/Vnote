# Cherry and Chocolate
[CFGym101981C]

Cherry and Chocolate play a game on a tree. First, Cherry picks a node and paints it pink. Then, Chocolate picks another node and paints it brown. Afterwards, Cherry picks yet another node and paints it pink.The game ends here. Chocolate doesn’t get the second move.For each node v, if there is no path from v to the brown node without passing through a pink node,Cherry gets a point.Cherry wants to maximize her score, and Chocolate wants to minimize it. If both players play optimally,what will Cherry’s score be?

假设第一个人枚举一个位置 $u$，那么第二个人的选择就一定是把 $u$ 扔掉后剩下某个子树的重心，而第三个人的选择则一定是这个重心最大的那个儿子。故若枚举第一个人的选择，接下来两个人的选择可以在 $O(n)$ 时间得到。  
考虑优化第一个人的选择。注意到把第一个人的选择向着除了这一轮第二个人选择的那个点所在的子树外的点移动不会更优，那么它就只能向这个子树移动。用点分治优化这个过程，这样就只会计算 $O(logn)$ 次了。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
const int maxN=101000;
const int maxM=maxN<<1;
const int inf=1000000000;
int n,Ans=0;
int edgecnt=-1,Head[maxN],Next[maxM],V[maxM];
int rt,rtsize,truert,vis[maxN],Sz[maxN],Mx[maxN],Gsz[maxN],Gmx[maxN];

void Add_Edge(int u,int v);
void dfs_size(int u,int fa,int size);
void dfs_calc(int u,int fa,int size);
void Divide(int u,int size);

int main(){
    scanf("%d",&n);mem(Head,-1);
    for (int i=1;i<n;i++){
        int u,v;scanf("%d%d",&u,&v);
        Add_Edge(u,v);
    }
    Divide(1,n);
    printf("%d\n",Ans);return 0;
}
void Add_Edge(int u,int v){
    Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
    Next[++edgecnt]=Head[v];Head[v]=edgecnt;V[edgecnt]=u;
    return;
}
void dfs_size(int u,int fa,int size){
    Sz[u]=1;Mx[u]=0;
    for (int i=Head[u];i!=-1;i=Next[i])
        if (V[i]!=fa&&vis[V[i]]==0){
            dfs_size(V[i],u,size);Sz[u]+=Sz[V[i]];
            Mx[u]=max(Mx[u],Sz[V[i]]);
        }
    Mx[u]=max(Mx[u],size-Sz[u]);
    if (Mx[u]<rtsize) rtsize=Mx[u],rt=u;
    return;
}
void dfs_get(int u,int fa){
    Gsz[u]=1;
    for (int i=Head[u];i!=-1;i=Next[i]) if (V[i]!=fa) dfs_get(V[i],u),Gsz[u]+=Gsz[V[i]];
    return;
}
void dfs_calc(int u,int fa,int size){
    Gsz[u]=1;Mx[u]=0;
    for (int i=Head[u];i!=-1;i=Next[i])
        if (V[i]!=fa){
            dfs_calc(V[i],u,size);Gsz[u]+=Gsz[V[i]];
            Mx[u]=max(Mx[u],Gsz[V[i]]);
        }
    Mx[u]=max(Mx[u],size-Gsz[u]);
    if (Mx[u]<rtsize) rtsize=Mx[u],rt=u;
}
void Divide(int start,int size){
    rtsize=inf;dfs_size(start,start,size);
    vis[rt]=1;truert=rt;
    int tans=inf,tu;
    for (int i=Head[truert];i!=-1;i=Next[i]){
        dfs_get(V[i],truert);
        rtsize=inf;
        dfs_calc(V[i],truert,Gsz[V[i]]);
        if (Mx[rt]+n-Gsz[V[i]]<tans) tans=Mx[rt]+n-Gsz[V[i]],tu=V[i];
    }
    Ans=max(Ans,tans);
    if (tans==inf||vis[tu]) return;
    int tsize=Sz[tu]>Sz[truert]?size-Sz[truert]:Sz[tu];
    Divide(tu,tsize);
    return;
}
```