# Codeforces Round #503 (by SIS, Div. 1)(VP)

[link](https://codeforces.com/contest/1019)

## A.Elections

给定 $m$ 个政党，$n$ 个人与各自的投票意向以及让某个人改变意向花费的代价。现在求最小的代价使得编号为 1 的政党得票数严格大于其它政党。

枚举其余编号为 1 的政党的得票，那么其它的政党得票不能超过这个数，贪心地选取。  
一个更优秀的做法是，可以证明上述代价是关于得票单峰的，所以可以用三分代替枚举。

```cpp
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
const int maxN=3030;
const ll INF=1e18;

int n,m;
vector<int> B[maxN];

ll Calc(int limit);
int main(){
    scanf("%d%d",&n,&m);
    for (int i=1;i<=n;i++){
        int x,y;scanf("%d%d",&x,&y);B[x].push_back(y);
    }
    for (int i=1;i<=m;i++) sort(B[i].begin(),B[i].end());
    ll Ans=INF;for (int i=1;i<=n;i++) Ans=min(Ans,Calc(i));
    printf("%lld\n",Ans);return 0;
}
ll Calc(int limit){
    vector<int> Rn;ll sum=0;int cnt=B[1].size();
    for (int i=2;i<=m;i++){
        int sz=B[i].size();
        for (int j=0;j<=sz-limit;j++) sum=sum+B[i][j],++cnt;
        for (int j=max(0,sz-limit+1);j<sz;j++) Rn.push_back(B[i][j]);
    }
    sort(Rn.begin(),Rn.end());
    if (cnt+Rn.size()<limit) return INF;
    int p=0;
    while (cnt<limit){
        sum=sum+Rn[p];++cnt;++p;
    }
    return sum;
}
```

## B.The hat

交互题。给定一圈 $2n$ 个人，每个人手中有一个数，相邻两人手中的数相差为 1。每次可以询问某一个人手里的数是什么，求找出一个人  i 使得 i 与 i+n 手中的数相同，或输出无解。

当 $2n=4k+2$ 时一定无解，因为此时两人之间相隔 $2k+1$ 个人，差一定为奇数。否则一定有解。每一个人的数字可以看做是 1,-1 的前缀和，考虑二分，若左端点与中点的值同号，说明合法的解一定在右边，否则在左边。

```cpp
#include<bits/stdc++.h>
using namespace std;

int n;

int Query(int p);
int main(){
    scanf("%d",&n);
    if (n%4){
        puts("! -1");return 0;
    }
    int l=1,r=n/2,lkey=Query(l);
    while (l+1<r){
        int mid=(l+r)>>1;
        int qk=Query(mid);
        if (1ll*qk*lkey>0) l=mid,lkey=qk;
        else r=mid-1;
    }
    Query(l);Query(r);
    return 0;
}
int Query(int p){
    printf("? %d\n? %d\n",p,p+n/2);fflush(stdout);
    int a,b;scanf("%d %d",&a,&b);
    if (a==b){
        printf("! %d\n",p);exit(0);
    }
    return b-a;
}
```

## C.Sergey's problem

给出一张有向图。现在要求构造一个点集，满足点集中的点两两没有连边，且非点集中的点与点集中的点的最近距离不超过 2 。

考虑一种递归的构造方法。对于一张图 $G$，任意选定一个点 $u$ 加入答案，删除它以及它的所有还存在的出边及出点，递归下去。这样能够保证所有的点距离答案点集中的点距离不超过 2 ，但是无法保证点集中的点两两没有连边。解决办法是，递归回来的时候，把 u 的所有出边强制设置为不选择，即就算原来选择也设置为不选择，这样即可以保证原来性质的成立，同时也能够保证点集无两两连边。  
实现的时候可以不用这么麻烦，直接先从头往后做一遍扫描，再从后往前作一遍扫描。

```cpp
#include<bits/stdc++.h>
using namespace std;

const int maxN=1010000;

int n,m;
vector<int> E[maxN];
int vis[maxN];

int main(){
    scanf("%d%d",&n,&m);
    for (int i=1;i<=m;i++){
        int u,v;scanf("%d%d",&u,&v);E[u].push_back(v);
    }
    for (int i=1;i<=n;i++)
        if (vis[i]==0){
            vis[i]=1;for (int j=0,sz=E[i].size();j<sz;j++) if (!vis[E[i][j]]) vis[E[i][j]]=-1;
        }
    for (int i=n;i>=1;i--)
        if (vis[i]==1) for (int j=0,sz=E[i].size();j<sz;j++) vis[E[i][j]]=-1;
    int cnt=0;for (int i=1;i<=n;i++) if (vis[i]==1) ++cnt;
    printf("%d\n",cnt);for (int i=1;i<=n;i++) if (vis[i]==1) printf("%d ",i);return 0;
}
```

## D.Large Triangle

给定平面上若干个点，要求找出一个三角形满足其面积为给定的 S 。

枚举两个点，此时固定了三角形的底边，与其面积相关的就只有三角形的高了。若此时剩余的点能够按照到这两个点直线的距离排序，那么就可以二分出这个距离。  
考虑把所有两点组合的底边离线下来，按照斜率排序，并把所有的点按照 x 排序。从斜率小往斜率大走，可以发现，与直线距离关系变化的点有且只有当前线段的两个端点，交换两个即可。

```cpp
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
const int maxN=2010;

struct Point{
    ll x,y;
    double k(){
        return (double)y/(double)x;
    }
};
struct SorterData{
    Point L;int a,b;double agl;
};

int n,lcnt;ll S;
Point P[maxN];
SorterData Std[maxN*maxN];
int Id[maxN];

Point operator + (Point A,Point B);
Point operator - (Point A,Point B);
ll Cross(Point A,Point B);
bool xcmp(Point A,Point B);
bool lcmp(SorterData A,SorterData B);
ll calc(int a,int b,int c);
int main(){
    scanf("%d %lld",&n,&S);for (int i=1;i<=n;i++) scanf("%lld%lld",&P[i].x,&P[i].y);
    sort(&P[1],&P[n+1],xcmp);S=S+S;
    for (int i=1;i<=n;i++) for (int j=i+1;j<=n;j++) Std[++lcnt]=((SorterData){P[j]-P[i],i,j,(P[j]-P[i]).k()});
    sort(&Std[1],&Std[lcnt+1],lcmp);
    for (int i=1;i<=n;i++) Id[i]=i;

    for (int i=1;i<=lcnt;i++){
        int u=Id[Std[i].a],v=Id[Std[i].b];
        if (u>v) swap(u,v);
        int l=1,r=u-1;
        while (l<=r){
            int mid=(l+r)>>1;
            if (calc(mid,u,v)<S) r=mid-1;
            else l=mid+1;
        }
        l=v+1;r=n;
        while (l<=r){
            int mid=(l+r)>>1;
            if (calc(mid,u,v)<S) l=mid+1;
            else r=mid-1;
        }
        swap(P[u],P[v]);swap(Id[Std[i].a],Id[Std[i].b]);
    }
    puts("No");return 0;
}
Point operator + (Point A,Point B){
    return ((Point){A.x+B.x,A.y+B.y});
}
Point operator - (Point A,Point B){
    return ((Point){A.x-B.x,A.y-B.y});
}
ll Cross(Point A,Point B){
    return A.x*B.y-A.y*B.x;
}
bool xcmp(Point A,Point B){
    return A.x<B.x;
}
bool lcmp(SorterData A,SorterData B){
    return A.agl<B.agl;
}
ll calc(int a,int b,int c){
    ll area=abs(Cross(P[a]-P[b],P[c]-P[b]));
    if (fabs(area-S)<1e-8){
        puts("Yes");
        printf("%lld %lld\n%lld %lld\n%lld %lld\n",(ll)P[a].x,(ll)P[a].y,(ll)P[b].x,(ll)P[b].y,(ll)P[c].x,(ll)P[c].y);
        exit(0);
    }
    return area;
}
```

## E.Raining season

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