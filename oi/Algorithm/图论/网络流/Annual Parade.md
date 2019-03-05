# Annual Parade
[CC-PARADE]

In the magic land, there is an annual parade hold on each spring.   
There are N cities in magic land, and M directed roads between cities.   
On the parade, there will be some(may be 0) heroes travel in this land, for each hero: He start at city begin[i], traveling to some cities, and finish at city end[i]. Note that: begin[i] may be equals to end[i], but he must at least moved to another city during this travel. He can go on one road many times, but it will have a cost for each time.  
The cost of this parade is the sum of these items:  
1. The sum of costs by traveling on roads. (If a road is passed by k heroes, then it must be count k times.)  
2. If for a hero, he ended at a city that not equals to his start city, i.e. begin[i] != end[i], then it will cost C dollars to move him back to his home.   
3. If for a city, there is no heroes visited, then we must pay for the citizen C dollars as compensate.  
The value of C may change every year, and we can predict this value in the following K years. Your task is: calculate the minimal cost of each year.

注意到要付出 C 的代价，当且仅当没有经过某个城市或者作为某个英雄起始城市但不形成回路。两种情况综合起来，其实就是某个点没有入度。像普通路径覆盖那样建图，即拆点+Floyed，初始时代价为 nC ，每增广一次，会减少一个 C ，增加若干代价。那么可以看做是若干 kC+b 的关于 C 的一次函数，注意到随着 k 的减小，ｂ 是不断增大的，把每一次增广过程记录下来，那么对于每一个询问，三分/二分找到最优点即可。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

const int maxN=300;
const int maxNN=maxN<<1;
const int maxM=30300*10;
const int inf=1000000000;

class Edge{
    public:
    int v,flow,w;
};

int n,m,K,S,T,Mp[maxN][maxN];
int ecnt=-1,Hd[maxNN],Nt[maxM];
Edge E[maxM];
int Qu[maxNN],Dst[maxNN],inq[maxNN],Flow[maxNN],Path[maxNN];
int C[maxN];

void Add_Edge(int u,int v,int flow,int w);
bool Spfa();
int main(){
    scanf("%d%d%d",&n,&m,&K);memset(Mp,63,sizeof(Mp));memset(Hd,-1,sizeof(Hd));
    for (int i=1;i<=n;i++) Mp[i][i]=0;
    for (int i=1;i<=m;i++){
        int u,v,w;scanf("%d%d%d",&u,&v,&w);
        Mp[u][v]=min(Mp[u][v],w);
    }
    for (int k=1;k<=n;k++) for (int i=1;i<=n;i++) for (int j=1;j<=n;j++) Mp[i][j]=min(Mp[i][j],Mp[i][k]+Mp[k][j]);
    S=n+n+1;T=S+1;
    for (int i=1;i<=n;i++) Add_Edge(S,i,1,0),Add_Edge(i+n,T,1,0);
    for (int i=1;i<=n;i++) for (int j=1;j<=n;j++) if (i!=j&&Mp[i][j]!=Mp[0][0]) Add_Edge(i,j+n,inf,Mp[i][j]);

    for (int i=n-1;i>=0;i--){
        Spfa();C[i]=Dst[T]+C[i+1];
        int now=T;
        while (now!=S){
            E[Path[now]].flow-=Flow[T];
            E[Path[now]^1].flow+=Flow[T];
            now=E[Path[now]^1].v;
        }
    }
    while (K--){
        int c;scanf("%d",&c);
        int l=0,r=n,Ans=inf;
        while (l<=r){
            int mid=(l+r)>>1;Ans=min(Ans,mid*c+C[mid]);
            if (mid*c+C[mid]<=(mid+1)*c+C[mid+1]) r=mid-1;
            else l=mid+1;
        }
        printf("%d\n",Ans);
    }
    return 0;
}
void Add_Edge(int u,int v,int flow,int w){
    Nt[++ecnt]=Hd[u];Hd[u]=ecnt;E[ecnt]=((Edge){v,flow,w});
    Nt[++ecnt]=Hd[v];Hd[v]=ecnt;E[ecnt]=((Edge){u,0,-w});
    return;
}
bool Spfa(){
    memset(Dst,63,sizeof(Dst));int ql=0,qr=1;Qu[1]=S;Dst[S]=0;Flow[S]=inf;
    while (ql!=qr){
        ++ql;ql%=maxNN;int u=Qu[ql];
        for (int i=Hd[u];i!=-1;i=Nt[i])
            if (E[i].flow&&Dst[E[i].v]>Dst[u]+E[i].w){
                Dst[E[i].v]=Dst[u]+E[i].w;Flow[E[i].v]=min(Flow[u],E[i].flow);Path[E[i].v]=i;
                if (!inq[E[i].v]){
                    ++qr;qr%=maxNN;Qu[qr]=E[i].v;inq[E[i].v]=1;
                }
            }
        inq[u]=0;
    }
    return Dst[T]!=Dst[0];
}
```