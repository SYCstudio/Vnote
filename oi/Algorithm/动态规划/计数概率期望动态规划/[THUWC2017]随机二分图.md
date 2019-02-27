# [THUWC2017]随机二分图
[BZOJ5006 Luogu4547]

某人在玩一个非常神奇的游戏。这个游戏中有一个左右各 $n$ 个点的二分图，图中的边会按照一定的规律随机出现。  
为了描述这些规律，某人将这些边分到若干个组中。每条边或者不属于任何组 （这样的边一定不会出现），或者只属于一个组。  
有且仅有以下三类边的分组：  
这类组每组只有一条边，该条边恰好有 $50\%$ 的概率出现。  
这类组每组恰好有两条边，这两条边有 $50\%$ 的概率同时出现，有 $50\%$ 的概率同时不出现。  
这类组每组恰好有两条边，这两条边恰好出现一条，各有 $50\%$ 的概率出现。  
组和组之间边的出现都是完全独立的。  
某人现在知道了边的分组和组的种类，想要知道完美匹配数量的期望是多少。你能帮助她解决这个问题吗？

由于要求的是完美匹配，即每一个点都要在匹配中，所以在考虑的时候直接考虑每条边是否在完美匹配中而不是考虑是否在图中。  
设 F[S][T] 表示两边的点集状态分别是 S 和 T 的期望，对于第一类边，直接考虑是否能够直接加进去。对于第二类边和第三类边，以第二类边为例，假设都按照拆分成第一类边处理，那么当两条边只有一条在匹配中时，这个概率是没问题的，但是两条边同时出现的概率是有问题的，是 $25\%$，而实际应该是 $50\%$，为了补上这部分，另外再把两条边一起加进去算贡献。而对于第三类边则是多算了这 $25\%$ 的贡献。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<map>
#include<vector>
#include<iostream>
using namespace std;

#define pw(x) (1<<(x))
class Edge{
    public:
    int a,b,c,d,opt;
};

const int maxN=15;
const int maxM=maxN*maxN;
const int Mod=1e9+7;
const int inv2=500000004;
const int inv4=250000002;

int n,m,Mp[maxN][maxN];
vector<Edge> To[maxN];
map<int,int> Rc;

int dfs(int S,int T);
void Plus(int &x,int y);

int main(){
    scanf("%d%d",&n,&m);
    for (int i=1;i<=m;i++){
        int opt;scanf("%d",&opt);
        if (opt==0){
            int u,v;scanf("%d%d",&u,&v);--u;--v;Mp[u][v]=1;
        }
        else{
            int a,b,c,d;scanf("%d%d%d%d",&a,&b,&c,&d);--a;--b;--c;--d;
            if (a>c) swap(a,c),swap(b,d);Mp[a][b]=Mp[c][d]=1;
            if (a==c||b==d) continue;
            To[a].push_back((Edge){a,b,c,d,opt});
        }
    }
    int p2=1;for (int i=1;i<=n;i++) p2=2ll*p2%Mod;
    Rc[0]=1;
    printf("%lld\n",1ll*dfs(pw(n)-1,pw(n)-1)*p2%Mod);
    return 0;
}
int dfs(int S,int T){
    if (Rc.count((S<<15)|T)) return Rc[(S<<15)|T];
    int left=0,ret=0;while (left<=n-1&&!(S&pw(left))) ++left;
    for (int i=0;i<n;i++) if (Mp[left][i]&&(T&pw(i))) Plus(ret,1ll*dfs(S^pw(left),T^pw(i))*inv2%Mod);
    for (int i=0,sz=To[left].size();i<sz;i++)
        if ((S&pw(To[left][i].c))&&(T&pw(To[left][i].b))&&(T&pw(To[left][i].d))){
            (To[left][i].opt==1)?Plus(ret,1ll*dfs(S^pw(left)^pw(To[left][i].c),T^pw(To[left][i].b)^pw(To[left][i].d))*inv4%Mod):
                              Plus(ret,1ll*dfs(S^pw(left)^pw(To[left][i].c),T^pw(To[left][i].b)^pw(To[left][i].d))*(Mod-inv4)%Mod);
        }
    return Rc[(S<<15)|T]=ret;
}
void Plus(int &x,int y){
    x+=y;if (x>=Mod) x-=Mod;return;
}
```