# Team Rocket Rises Again
[CF757F]


It's the turn of the year, so Bash wants to send presents to his friends. There are n cities in the Himalayan region and they are connected by m bidirectional roads. Bash is living in city s. Bash has exactly one friend in each of the other cities. Since Bash wants to surprise his friends, he decides to send a Pikachu to each of them. Since there may be some cities which are not reachable from Bash's city, he only sends a Pikachu to those friends who live in a city reachable from his own city. He also wants to send it to them as soon as possible.  
He finds out the minimum time for each of his Pikachus to reach its destination city. Since he is a perfectionist, he informs all his friends with the time their gift will reach them. A Pikachu travels at a speed of 1 meters per second. His friends were excited to hear this and would be unhappy if their presents got delayed. Unfortunately Team Rocket is on the loose and they came to know of Bash's plan. They want to maximize the number of friends who are unhappy with Bash.  
They do this by destroying exactly one of the other n - 1 cities. This implies that the friend residing in that city dies, so he is unhappy as well.  
Note that if a city is destroyed, all the roads directly connected to the city are also destroyed and the Pikachu may be forced to take a longer alternate route.  
Please also note that only friends that are waiting for a gift count as unhappy, even if they die.  
Since Bash is already a legend, can you help Team Rocket this time and find out the maximum number of Bash's friends who can be made unhappy by destroying exactly one city.

先跑一个最短路得到最短路 DAG ，再跑支配树算法得到支配树。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
#include<queue>
#include<iostream>
using namespace std;

typedef long long ll;
const int maxN=202000;

int n,m,S;
vector<pair<int,int> > dE[maxN];
priority_queue<pair<ll,int> > H;
vector<int> G[maxN],iG[maxN],sG[maxN],fG[maxN];
ll D[maxN];
int hout[maxN],dfncnt,dfn[maxN],idfn[maxN],fa[maxN];
int ufs[maxN],mi[maxN],semi[maxN],idom[maxN],Ans[maxN];

void dfs_init(int u);
int find(int x);
void dfs_calc(int u);
int main(){
    scanf("%d%d%d",&n,&m,&S);
    for (int i=1;i<=m;i++){
        int u,v,w;scanf("%d%d%d",&u,&v,&w);
        dE[u].push_back(make_pair(v,w));
        dE[v].push_back(make_pair(u,w));
    }
    memset(D,63,sizeof(D));D[S]=0;H.push(make_pair(0,S));
    while (!H.empty()){
        int u=H.top().second;H.pop();if (hout[u]) continue;
        hout[u]=1;
        for (int i=0,sz=dE[u].size();i<sz;i++)
            if (D[dE[u][i].first]>D[u]+dE[u][i].second)
                H.push(make_pair(-(D[dE[u][i].first]=D[u]+dE[u][i].second),dE[u][i].first));
    }
    for (int i=1;i<=n;i++)
        for (int j=0,sz=dE[i].size();j<sz;j++)
            if (D[dE[i][j].first]==D[i]+dE[i][j].second)
                G[i].push_back(dE[i][j].first),iG[dE[i][j].first].push_back(i);

    dfs_init(S);
    for (int i=1;i<=n;i++) ufs[i]=mi[i]=semi[i]=idom[i]=i;
    for (int i=dfncnt;i>=2;i--){
        int u=idfn[i],tmp=dfncnt;
        for (int j=0,sz=iG[u].size();j<sz;j++){
            int v=iG[u][j];find(v);
            if (dfn[v]<dfn[u]) tmp=min(tmp,dfn[v]);
            else find(v),tmp=min(tmp,dfn[semi[mi[v]]]);
        }
        semi[u]=idfn[tmp];ufs[u]=fa[u];sG[semi[u]].push_back(u);

        u=idfn[i-1];
        for (int j=0,sz=sG[u].size();j<sz;j++){
            int v=sG[u][j];find(v);
            if (semi[v]==semi[mi[v]]) idom[v]=semi[v];
            else idom[v]=-mi[v];
        }
    }

    for (int i=2;i<=dfncnt;i++){
        int u=idfn[i];
        if (idom[u]<0) idom[u]=idom[-idom[u]];
        fG[idom[u]].push_back(u);
    }

    dfs_calc(S);
    int mx=0;for (int i=2;i<=dfncnt;i++) mx=max(mx,Ans[idfn[i]]);
    printf("%d\n",mx);return 0;
}
void dfs_init(int u){
    idfn[dfn[u]=++dfncnt]=u;
    for (int i=0,sz=G[u].size();i<sz;i++) if (!dfn[G[u][i]]) fa[G[u][i]]=u,dfs_init(G[u][i]);
    return;
}
int find(int x){
    if (ufs[x]==x) return x;
    int fa=ufs[x];ufs[x]=find(ufs[x]);
    if (dfn[semi[mi[fa]]]<dfn[semi[mi[x]]]) mi[x]=mi[fa];
    return ufs[x];
}
void dfs_calc(int u){
    Ans[u]=1;
    for (int i=0,sz=fG[u].size();i<sz;i++) dfs_calc(fG[u][i]),Ans[u]+=Ans[fG[u][i]];
    return;
}
```