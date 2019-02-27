# Raining season
[CF1019E]

By the year 3018, Summer Informatics School has greatly grown. Hotel «Berendeetronik» has been chosen as a location of the school. The camp consists of $ n $ houses with $ n-1 $ pathways between them. It is possible to reach every house from each other using the pathways.  
Everything had been perfect until the rains started. The weather forecast promises that rains will continue for $ m $ days. A special squad of teachers was able to measure that the $ i $ -th pathway, connecting houses $ u_i $ and $ v_i $ , before the rain could be passed in $ b_i $ seconds. Unfortunately, the rain erodes the roads, so with every day the time to pass the road will increase by $ a_i $ seconds. In other words, on the $ t $ -th (from zero) day after the start of the rain, it will take $ a_i \cdot t + b_i $ seconds to pass through this road.  
Unfortunately, despite all the efforts of teachers, even in the year 3018 not all the students are in their houses by midnight. As by midnight all students have to go to bed, it is important to find the maximal time between all the pairs of houses for each day, so every student would know the time when he has to run to his house.  
Find all the maximal times of paths between every pairs of houses after $ t=0 $ , $ t=1 $ , ..., $ t=m-1 $ days.

给定一棵树，设时间为 $t$ ，一条边的边权为 $a _ it+b _ i$ ，求 $t=[0..m-1]$ 每天树上的最长路径。

树上每一条路径的问题，自然想到点分治。但是如果有多棵子树的话不好合并，所以考虑边分。每次边分后，两侧的信息均是一个下凸包的形式，那么合并即求这两个下凸包的闵可夫斯基和。最后再对所有凸包进行合并。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
#include<cmath>
#include<iostream>
using namespace std;

typedef long long ll;
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define sqr(x) ((x)*(x))

class Point{
    public:
    ll x,y;
    double len(){
        return sqrt(sqr((double)x)+sqr((double)y));
    }
    ll calc(ll k){
        return x*k+y;
    }
    Point operator + (Point A){
        return ((Point){x+A.x,y+A.y});
    }
    Point operator - (Point A){
        return ((Point){x-A.x,y-A.y});
    }
};
class VData{
    public:
    int v,a,b;
};

const int maxN=100002*4;
const int maxM=maxN<<1;
const int inf=1000000000;

int n,m;
vector<VData> To[maxN],Sn[maxN];
int edgecnt=-1,Head[maxN],Next[maxM],V[maxM];
pair<ll,ll> W[maxM];
int vis[maxN],rte,rtsize,Sz[maxN],tot[2],anstop=0;
Point C[2][maxN],Bp[maxN],St[4000000],Ans[4000000];

void dfs_init(int u,int fa);
void Add_Edge(int u,int v,pair<ll,ll> w);
void dfs_root(int u,int fa,int size);
void dfs_get(int u,int fa,int opt,ll a,ll b);
void Divide(int u,int size);
double Cross(Point A,Point B);
bool cmpx(Point A,Point B);
bool cmpy(Point A,Point B);
bool cmpc(Point A,Point B);
ostream & operator << (ostream & os,Point A);
void Convex(Point *P,int &T);
double Intersection(Point A,Point B);

int main(){
    scanf("%d%d",&n,&m);mem(Head,-1);
    for (int i=1;i<n;i++){
        int u,v,a,b;scanf("%d%d%d%d",&u,&v,&a,&b);
        To[u].push_back((VData){v,a,b});To[v].push_back((VData){u,a,b});
    }
    dfs_init(1,1);
    for (int i=1,sz;i<=n;i++)
        if (Sn[i].size()<=2)
            for (int j=0,sz=Sn[i].size();j<sz;j++) Add_Edge(i,Sn[i][j].v,make_pair(Sn[i][j].a,Sn[i][j].b));
        else{
            int ls=++n,rs=++n;Add_Edge(i,ls,make_pair(0,0));Add_Edge(i,rs,make_pair(0,0));
            for (int j=0,sz=Sn[i].size();j<sz;j++)
                if (j&1) Sn[rs].push_back(Sn[i][j]);
                else Sn[ls].push_back(Sn[i][j]);
        }
    Divide(1,n);
    sort(&Ans[1],&Ans[anstop+1],cmpx);
    int top=0;
    for (int i=1;i<=anstop;i++){
        if  (top>=1&&St[top].x==Ans[i].x) continue;
        while (top>=2&&Intersection(St[top-1],St[top])>=Intersection(St[top],Ans[i])) --top;
        St[++top]=Ans[i];
    }
    for (int i=0,j=1;i<m;i++){
        while (j<top&&St[j+1].calc(i)>=St[j].calc(i)) ++j;
        printf("%lld ",(ll)St[j].calc(i));
    }
    printf("\n");return 0;
}
void dfs_init(int u,int fa){
    for (int i=0,sz=To[u].size();i<sz;i++) if (To[u][i].v!=fa) Sn[u].push_back(To[u][i]),dfs_init(To[u][i].v,u);
    return;
}
void Add_Edge(int u,int v,pair<ll,ll> w){
    Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;W[edgecnt]=w;
    Next[++edgecnt]=Head[v];Head[v]=edgecnt;V[edgecnt]=u;W[edgecnt]=w;
    return;
}
void dfs_root(int u,int fa,int size){
    Sz[u]=1;
    for (int i=Head[u];i!=-1;i=Next[i])
        if (V[i]!=fa&&vis[i>>1]==0){
            dfs_root(V[i],u,size);Sz[u]+=Sz[V[i]];
            int k=max(Sz[V[i]],size-Sz[V[i]]);
            if (k<rtsize) rtsize=k,rte=i;
        }
    return;
}
void dfs_get(int u,int fa,int opt,ll a,ll b){
    if (tot[opt]==0||(C[opt][tot[opt]].x!=a)||(C[opt][tot[opt]].y!=b)) C[opt][++tot[opt]]=((Point){a,b});
    for (int i=Head[u];i!=-1;i=Next[i])
        if (V[i]!=fa&&vis[i>>1]==0) dfs_get(V[i],u,opt,a+W[i].first,b+W[i].second);
    return;
}
void Divide(int start,int size){
    rtsize=inf;dfs_root(start,start,size);
    if (rtsize==inf) return;
    int u=V[rte],v=V[rte^1];vis[rte>>1]=1;tot[0]=tot[1]=0;
    dfs_get(u,u,0,0,0);dfs_get(v,v,1,0,0);

    Convex(C[0],tot[0]);Convex(C[1],tot[1]);

    int top=1,p0=1,p1=1,up0=0,up1=0;Bp[1]=C[0][1]+C[1][1];
    C[0][tot[0]+1]=C[0][1];C[1][tot[1]+1]=C[1][1];
    for (int i=1;i<=tot[0];i++) C[0][i]=C[0][i+1]-C[0][i];
    for (int i=1;i<=tot[1];i++) C[1][i]=C[1][i+1]-C[1][i];

    while (up0<tot[0]&&(C[0][up0+1].y>0||(C[0][up0+1].y==0&&C[0][up0+1].x>=0))) ++up0;
    while (up1<tot[1]&&(C[1][up1+1].y>0||(C[1][up1+1].y==0&&C[1][up1+1].x>=0))) ++up1;

    while (p0<=up0||p1<=up1){
        if (p1>up1||(p0<=up0&&Cross(C[0][p0],C[1][p1])>=0)) ++top,Bp[top]=Bp[top-1]+C[0][p0++];
        else ++top,Bp[top]=Bp[top-1]+C[1][p1++];
    }
    while (p0<=tot[0]||p1<=tot[1]){
        if (p1>tot[1]||(p0<=tot[0]&&Cross(C[0][p0],C[1][p1])>=0)) ++top,Bp[top]=Bp[top-1]+C[0][p0++];
        else ++top,Bp[top]=Bp[top-1]+C[1][p1++];
    }

    Convex(Bp,top);

    for (int i=1;i<=top;i++) Ans[++anstop]=Bp[i]+((Point){W[rte].first,W[rte].second});
    Divide(u,Sz[u]);Divide(v,size-Sz[u]);return;
}
double Cross(Point A,Point B){
    return 1.0*A.x*B.y-1.0*A.y*B.x;
}
bool cmpx(Point A,Point B){
    if (A.x!=B.x) return A.x<B.x;
    return A.y>B.y;
}
bool cmpy(Point A,Point B){
    if (A.y!=B.y) return A.y<B.y;
    return A.x<B.x;
}
bool cmpc(Point A,Point B){
    return Cross(A,B)>0||(Cross(A,B)==0&&A.len()<B.len());
}
ostream & operator << (ostream &os,Point A){
    os<<"("<<A.x<<","<<A.y<<")";return os;
}
void Convex(Point *P,int &T){
    sort(&P[1],&P[T+1],cmpx);int top=0;
    for (int i=1;i<=T;i++){
        if (top&&St[top].x==P[i].x) continue;
        while (top>=2&&Intersection(St[top-1],St[top])>=Intersection(St[top],P[i])) --top;
        St[++top]=P[i];
    }
    for (int i=top;i>=1;i--) P[i]=St[top-i+1];T=top;
    return;
}
double Intersection(Point A,Point B){
    return (double)(B.y-A.y)/(double)(A.x-B.x);
}
```