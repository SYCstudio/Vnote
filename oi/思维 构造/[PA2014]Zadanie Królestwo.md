# [PA2014]Zadanie Królestwo
[BZOJ3724]

你有一个无向连通图，边的总数为偶数。  
设图中有k个奇点（度数为奇数的点），你需要把它们配成k/2个点对（显然k被2整除）。对于每个点对(u,v)，你需要用一条长度为偶数（假设每条边长度为1）的路径将u和v连接。每条路径允许经过重复的点，但不允许经过重复的边。这k/2条路径之间也不能有重复的边。

如果没有长度为偶数的限制，那么就是直接建立一个虚点连上所有的奇数点求欧拉回路。  
二分图有一个比较优秀的性质，即从二分图的一端开始走，走一圈后回到这一端，经过的路径长度为偶数。考虑基于此的构造。  
对于一个点 u 拆分成 u 和 u' 分作二分图的两侧，并新建一个点 S 与所有原图中入度为奇数的点连边，那么原图的一条边 u-v 就必须选择成为 u-v' 或 v-u' 。下面的问题就是确定每一条边的选择使得图中存在欧拉回路。  
存在欧拉回路的充要条件是图连通且每个点度数为偶数。图连通已经能够得到，那么考虑使得点的度数为偶数。任意得到原图的一棵生成树，对于生成树外的边任意确定方向，而对于生成树内的边，自底向上从叶子开始往上推，每次用这个点到父亲的边来维持点度数的奇偶性。这样做唯一的问题在于最顶上那个点可能无法调整，但是可以证明的是当下面的点度数均调整成偶数后，顶上的点度数也一定是偶数，因为度数之和为偶数。 
得到上述构造后，在新图上跑欧拉回路算法即可得到解。

```cpp
#include<cstdio>
#include<cstring>
#include<algorithm>
#include<vector>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
const int maxN=300000*4;
const int maxM=maxN<<1;

int n,m,S;
vector<pair<int,int> > To[maxN];
int ufs[maxN],edgecnt=-1,Head[maxN],Next[maxM],V[maxM],D[maxN],Odd[maxN],WId[maxN];
int vis[maxM],top,St[maxN],Stid[maxN];

int find(int x);
void Add_Edge(int u,int v,int id);
void dfs_init(int u,int fa,int fid);
void dfs_eul(int u,int fid);

int main(){
    scanf("%d%d",&n,&m);mem(Head,-1);S=n+n+1;
    for (int i=1;i<=n;i++) ufs[i]=i;
    for (int i=1;i<=m;i++){
        int u,v;scanf("%d%d",&u,&v);Odd[u]^=1;Odd[v]^=1;
        if (find(u)!=find(v)) To[u].push_back(make_pair(v,i)),To[v].push_back(make_pair(u,i)),ufs[find(u)]=find(v);
        else Add_Edge(u,v+n,i);
    }
    for (int i=1;i<=n;i++) if (Odd[i]) Add_Edge(S,i,0);
    dfs_init(1,0,0);dfs_eul(1,0);--top;
    mem(vis,0);int start=1;
    while (St[start]!=S) ++top,St[top]=St[start],Stid[top]=Stid[start],++start;
    for (int i=start+1,j;i<=top;i=j+1){
        j=i;while (j<=top&&St[j]!=S) j++;
        printf("%d %d %d\n",St[i],St[j-1],j-i-1);
        for (int k=i;k+1<j;k++) printf("%d ",Stid[k]);
        printf("\n");
    }
    return 0;
}
int find(int x){
    if (ufs[x]!=x) ufs[x]=find(ufs[x]);
    return ufs[x];
}
void Add_Edge(int u,int v,int id){
    ++D[u];++D[v];
    Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;WId[edgecnt]=id;
    Next[++edgecnt]=Head[v];Head[v]=edgecnt;V[edgecnt]=u;WId[edgecnt]=id;
    return;
}
void dfs_init(int u,int fa,int fid){
    for (int i=0,sz=To[u].size();i<sz;i++) if (To[u][i].first!=fa) dfs_init(To[u][i].first,u,To[u][i].second);
    if (fa==0) return;
    if (D[u]&1) Add_Edge(u,fa+n,fid);
    else Add_Edge(u+n,fa,fid);
    return;
}
void dfs_eul(int u,int fid){
    for (int &i=Head[u];i!=-1;)
        if (vis[i>>1]==0){
            int j=i;i=Next[i];vis[j>>1]=1;
            dfs_eul(V[j],WId[j]);
        }
        else i=Next[i];
    St[++top]=u;Stid[top]=fid;return;
}
```