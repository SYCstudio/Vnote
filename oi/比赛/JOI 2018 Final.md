# JOI 2018 Final

## ストーブ (Stove)

贪心小水题。把所有间隔拿出来，取前 K 大。

```cpp
#include<cstdio>
#include<cstdlib>
#include<algorithm>
#include<queue>
using namespace std;

const int maxN=101000;

int n,K,T[maxN];
priority_queue<int> H;

int main(){
    scanf("%d%d",&n,&K);--K;
    for (int i=1;i<=n;i++) scanf("%d",&T[i]);
    int Ans=T[n]-T[1]+1;
    for (int i=1;i<n;i++) H.push(T[i+1]-T[i]-1);
    while (K--) Ans-=H.top(),H.pop();
    printf("%d\n",Ans);return 0;
}
```

## 美術展 (Art Exhibition)

贪心小水题。按照 size 排个序，然后就是前缀和 max 了。

```cpp
#include<cstdio>
#include<cstdlib>
#include<algorithm>
using namespace std;

typedef long long ll;
const int maxN=505000;

int n;
pair<ll,ll> S[maxN];

int main(){
    scanf("%d",&n);for (int i=1;i<=n;i++) scanf("%lld%lld",&S[i].first,&S[i].second);
    sort(&S[1],&S[n+1]);
    ll Ans=0,premx=S[1].first,sum=0;
    for (int i=1;i<=n;i++){
        premx=max(premx,S[i].first-sum);
        sum=sum+S[i].second;
        Ans=max(Ans,premx+sum-S[i].first);
    }
    printf("%lld\n",Ans);return 0;
}
```

## 団子職人 (Dango Maker)

注意到不在同一对角线的签子不会互相影响，那么直接对角线 DP 。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

const int maxN=3030;

int n,m;
char In[maxN][maxN];

int main(){
    scanf("%d%d",&n,&m);for (int i=1;i<=n;i++) scanf("%s",In[i]+1);
    int Ans=0;
    for (int i=1;i<n+m;i++){
        int x=min(n,i),y=max(1,i-n+1);
        int f0=0,f1=0,f2=0;
        while (x>=1&&y<=m){
            int fd=f0;f0=max(f0,max(f1,f2));
            if (In[x][y]=='G'){
                if (In[x][y-1]=='R'&&In[x][y+1]=='W') f1=max(f1,fd)+1;
                if (In[x-1][y]=='R'&&In[x+1][y]=='W') f2=max(f2,fd)+1;
            }
            --x;++y;
        }
        Ans=Ans+max(f0,max(f1,f2));
    }
    printf("%d\n",Ans);return 0;
}
```

## 定期券 (Commuter Pass)

先跑 Dijkstra 得到最短路 DAG ，以及每个点分别到 U,V 的最短路，问题转化为 DAG 上一条链，链两端分别到 U,V 的距离的最小值，直接在最短路 DAG 上推标号即可。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
#include<queue>
using namespace std;

typedef long long ll;
const int maxN=101000;
const ll INF=1e18;

int n,m,S,T,U,V;
vector<pair<int,ll> > E[maxN];
vector<int> ME[maxN],uME[maxN];
ll D[maxN],DU[maxN],DV[maxN],Mu[maxN],Mv[maxN];
int Dg[maxN],Tst[maxN],Mark[maxN];
int vis[maxN];
priority_queue<pair<ll,int> > H;

void Dijkstra(int S,ll *Dst);

int main(){
    scanf("%d%d%d%d%d%d",&n,&m,&S,&T,&U,&V);
    for (int i=1;i<=m;i++){
        int u,v,w;scanf("%d%d%d",&u,&v,&w);
        E[u].push_back(make_pair(v,w));
        E[v].push_back(make_pair(u,w));
    }
    Dijkstra(S,D);Dijkstra(U,DU);Dijkstra(V,DV);

    for (int i=1;i<=n;i++)
        for (int j=0,sz=E[i].size();j<sz;j++)
            if (D[E[i][j].first]==D[i]+E[i][j].second){
                ++Dg[i];
                ME[i].push_back(E[i][j].first);
                uME[E[i][j].first].push_back(i);
            }
    int ql=1,qr=0;Mark[T]=1;for (int i=1;i<=n;i++) if (!Dg[i]) Tst[++qr]=i;
    while (ql<=qr)
        for (int u=Tst[ql++],i=0,sz=uME[u].size();i<sz;i++){
            Mark[uME[u][i]]|=Mark[u];
            if ((--Dg[uME[u][i]])==0) Tst[++qr]=uME[u][i];
        }
    
    for (int i=1;i<=n;i++) Mu[i]=DU[i],Mv[i]=DV[i],Dg[i]=uME[i].size();
    
    ql=1;qr=1;Tst[1]=S;
    ll Ans=DU[V];
    while (ql<=qr){
        int u=Tst[ql++];Ans=min(Ans,Mu[u]+DV[u]);Ans=min(Ans,Mv[u]+DU[u]);
        for (int i=0,sz=ME[u].size();i<sz;i++)
            if (Mark[ME[u][i]]){
                int v=ME[u][i];
                Mu[v]=min(Mu[v],Mu[u]);Mv[v]=min(Mv[v],Mv[u]);
                if ((--Dg[v])==0) Tst[++qr]=v;
            }
    }
    printf("%lld\n",Ans);return 0;
}
void Dijkstra(int S,ll *Dst){
    memset(vis,0,sizeof(vis));for (int i=1;i<=n;i++) Dst[i]=INF;
    Dst[S]=0;
    while (!H.empty()) H.pop();
    H.push(make_pair(0,S));
    while (!H.empty()){
        int u=H.top().second;H.pop();if (vis[u]) continue;
        vis[u]=1;
        for (int i=0,sz=E[u].size();i<sz;i++){
            int v=E[u][i].first,w=E[u][i].second;
            if (Dst[v]>Dst[u]+w) H.push(make_pair(-(Dst[v]=Dst[u]+w),v));
        }
    }
    return;
}
```

## 毒蛇の脱走 (Snake Escaping)

对 0,1,? 分别小于等于 6 的情况分别做， ? 是直接枚举，另外两个则是高维前缀和/后缀和容斥。

```cpp
#include<cstdio>
#include<algorithm>
using namespace std;

#define pw(x) (1<<(x))
const int maxL=20;
const int maxN=pw(maxL)+10;

int L,Q;
char In[maxN],S[maxL+10];
int Pre[maxN],Suf[maxN],C[maxN];

int main(){
    scanf("%d%d",&L,&Q);scanf("%s",In);int N=pw(L);
    for (int i=0;i<N;i++) Pre[i]=Suf[i]=In[i]-'0',C[i]=C[i>>1]+(i&1);
    for (int i=0;i<L;i++) for (int j=0;j<N;j++) if (j&pw(i)) Pre[j]+=Pre[j^pw(i)];else Suf[j]+=Suf[j^pw(i)];
    while (Q--){
        scanf("%s",S);int s0=0,s1=0,s2=0;
        for (int i=0;i<L;i++)
            if (S[L-i-1]=='0') s0|=pw(i);
            else if (S[L-i-1]=='1') s1|=pw(i);
            else s2|=pw(i);
        int Ans=0;
        if (C[s2]<=0)
            for (int ss=s2;;ss=(ss-1)&s2){
                Ans=Ans+In[s1|ss]-'0';
                if (!ss) break;
            }
        else if (C[s0]<=6)
            for (int ss=s0;;ss=(ss-1)&s0){
                if (C[ss]&1) Ans=Ans-Suf[ss|s1];
                else Ans=Ans+Suf[ss|s1];
                if (!ss) break;
            }
        else
            for (int ss=s1;;ss=(ss-1)&s1){
                if ((C[ss]&1)^(C[s1]&1)) Ans=Ans-Pre[ss|s2];
                else Ans=Ans+Pre[ss|s2];
                if (!ss) break;
            }
        printf("%d\n",Ans);
    }
    return 0;
}
```