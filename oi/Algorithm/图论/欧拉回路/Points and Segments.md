# Points and Segments
[CF429E]

给定$n$ 条线段$[l_i,r_i]$ ,然后给这些线段红蓝染色，求最后直线上上任意一个点被蓝色及红色线段覆盖次数之差的绝对值不大于$1$

对于线段 [l,r] 连边 (l,r+1) ，设从左往右经过一条边表示把这条线断染成红色，反之染成蓝色，那么求欧拉回路就可以保证差值不超过 1 。注意到可能有奇数点的情况，把相邻奇数点两两配对即可。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define Dct(x) (lower_bound(&Num[1],&Num[num+1],x)-Num)
const int maxN=101000*2;
const int maxM=maxN*4;

int n,m;
int num,Num[maxN],L[maxN],R[maxN],Dg[maxN];
int edgecnt=-1,Hd[maxN],Nt[maxM],V[maxM],vis[maxM];

void Add_Edge(int u,int v);
void dfs(int u);
int main(){
    memset(Hd,-1,sizeof(Hd));
    scanf("%d",&n);for (int i=1;i<=n;i++) scanf("%d%d",&L[i],&R[i]),++R[i],Num[++num]=L[i],Num[++num]=R[i];
    sort(&Num[1],&Num[num+1]);num=unique(&Num[1],&Num[num+1])-Num-1;
    for (int i=1;i<=n;i++) L[i]=Dct(L[i]),R[i]=Dct(R[i]),Add_Edge(L[i],R[i]);
    for (int i=1,lst=0;i<=num;i++) if (Dg[i]&1) if (lst) Add_Edge(lst,i),lst=0;else lst=i;
    for (int i=0;i<n;i++) if (!vis[i]) dfs(V[i<<1]);
    for (int i=0;i<n;i++) printf("%d ",vis[i]-1);printf("\n");
    return 0;
}
void Add_Edge(int u,int v){
    ++Dg[u];++Dg[v];
    Nt[++edgecnt]=Hd[u];Hd[u]=edgecnt;V[edgecnt]=v;
    Nt[++edgecnt]=Hd[v];Hd[v]=edgecnt;V[edgecnt]=u;
    return;
}
void dfs(int u){
    for (int &i=Hd[u];i!=-1;)
        if (!vis[i>>1]){
            int j=i;i=Nt[i];vis[j>>1]=((j&1)?1:2);dfs(V[j]);
        }
        else i=Nt[i];
    return;
}
```