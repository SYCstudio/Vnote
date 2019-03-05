# Roads in Yusland
[CF671D]

Mayor of Yusland just won the lottery and decided to spent money on something good for town. For example, repair all the roads in the town.  
Yusland consists of n intersections connected by n - 1 bidirectional roads. One can travel from any intersection to any other intersection using only these roads.  
There is only one road repairing company in town, named "RC company". Company's center is located at the intersection 1. RC company doesn't repair roads you tell them. Instead, they have workers at some intersections, who can repair only some specific paths. The i-th worker can be paid ci coins and then he repairs all roads on a path from ui to some vi that lies on the path from ui to intersection 1.  
Mayor asks you to choose the cheapest way to hire some subset of workers in order to repair all the roads in Yusland. It's allowed that some roads will be repaired more than once.  
If it's impossible to repair all roads print  - 1.

原题意是给出一棵树和若干路径，选择某个路径需要付出一定代价 $c _ i$，求覆盖所有边的最小代价。  
列出线性规划的一般式子，然后转成对偶问题，发现问题转化为，一条边可以选多次，每条路径上所有边的选择次数不能超过 $c _ i$ ，求最多能选择多少次。  
注意到题目保证了所有的路径端点都是有祖先关系的，所以可以用可并堆自底向上更新。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
using namespace std;

typedef long long ll;
const int maxN=303000;
const int maxM=maxN<<1;

class HeapData{
    public:
    int ls,rs,id,rdis;
    ll key,lazy;
};

int n,m,rt[maxN],hcnt,Dmark[maxN];
int ecnt=-1,Hd[maxN],Nt[maxM],V[maxM];
HeapData H[maxN];
vector<int> Del[maxN];
ll Ans;

void Add_Edge(int u,int v);
void Minus(int x,ll mns);
void PushDown(int x);
int Merge(int u,int v);
void dfs(int u,int fa);
int main(){
    scanf("%d%d",&n,&m);memset(Hd,-1,sizeof(Hd));
    for (int i=1;i<n;i++){
        int u,v;scanf("%d%d",&u,&v);
        Add_Edge(u,v);Add_Edge(v,u);
    }
    for (int i=1;i<=m;i++){
        int a,b,c;scanf("%d%d%d",&a,&b,&c);
        if (a==b) continue;
        Del[b].push_back(i);H[++hcnt]=((HeapData){0,0,i,0,c,0});rt[a]=Merge(rt[a],hcnt);
    }
    dfs(1,0);
    printf("%lld\n",Ans);return 0;
}
void Add_Edge(int u,int v){
    Nt[++ecnt]=Hd[u];Hd[u]=ecnt;V[ecnt]=v;
    return;
}
void Minus(int x,ll mns){
    H[x].key-=mns;H[x].lazy+=mns;return;
}
void PushDown(int x){
    if (H[x].lazy){
        if (H[x].ls) Minus(H[x].ls,H[x].lazy);
        if (H[x].rs) Minus(H[x].rs,H[x].lazy);
        H[x].lazy=0;
    }
    return;
}
int Merge(int u,int v){
    if (!u||!v) return u+v;
    PushDown(u);PushDown(v);
    if (H[u].key>H[v].key) swap(u,v);
    H[u].rs=Merge(H[u].rs,v);
    if (H[H[u].ls].rdis<H[H[u].rs].rdis) swap(H[u].ls,H[u].rs);
    H[u].rdis=H[H[u].rs].rdis+1;
    return u;
}
void dfs(int u,int fa){
    for (int i=Hd[u];i!=-1;i=Nt[i]) if (V[i]!=fa) dfs(V[i],u),rt[u]=Merge(rt[u],rt[V[i]]);
    for (int i=0,sz=Del[u].size();i<sz;i++) Dmark[Del[u][i]]=1;
    while (rt[u]&&Dmark[H[rt[u]].id]) rt[u]=Merge(H[rt[u]].ls,H[rt[u]].rs);
    if (!rt[u]&&u!=1){
        puts("-1");exit(0);
    }
    if (rt[u]&&H[rt[u]].key){
        Ans+=H[rt[u]].key;Minus(rt[u],H[rt[u]].key);
    }
    return;
}
```