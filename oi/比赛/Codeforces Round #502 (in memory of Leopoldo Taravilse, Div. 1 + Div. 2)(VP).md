# Codeforces Round #502 (in memory of Leopoldo Taravilse, Div. 1 + Div. 2)(VP)

[link](https://codeforces.com/contest/1017)

## E.The Supersonic Rocket

给定两个点集，判定两个点集形成的凸多边形能否通过旋转、平移重合。

先做凸包，然后得到两点之间的距离，两边之间的旋转角度，然后 kmp 。

```cpp
#include<bits/stdc++.h>
using namespace std;

class Point{
public:
    double x,y;
    double len(){
        return sqrt(x*x+y*y);
    }
    double angle(){
        return atan2(y,x);
    }
};

const int maxN=101000;
const double eps=1e-10;
const double Pi=acos(-1);

int n,m;
Point M1[maxN+maxN],M2[maxN+maxN];
int Nxt[maxN*4];

Point operator + (Point A,Point B);
Point operator - (Point A,Point B);
ostream & operator << (ostream &os,Point A);
bool cmpc(Point A,Point B);
double Cross(Point A,Point B);
void Convex(Point *P,int &T);
bool check();
int main(){
    scanf("%d%d",&n,&m);
    for (int i=1;i<=n;i++) scanf("%lf%lf",&M1[i].x,&M1[i].y);
    for (int i=1;i<=m;i++) scanf("%lf%lf",&M2[i].x,&M2[i].y);
    Convex(M1,n);Convex(M2,m);

    if (check()) puts("YES");else puts("NO");
    return 0;
}
Point operator + (Point A,Point B){
    return ((Point){A.x+B.x,A.y+B.y});
}
Point operator - (Point A,Point B){
    return ((Point){A.x-B.x,A.y-B.y});
}
ostream & operator << (ostream & os,Point A){
    os<<"("<<A.x<<","<<A.y<<")";return os;
}
bool cmpc(Point A,Point B){
    return Cross(A,B)>0||(fabs(Cross(A,B))<eps&&A.len()<B.len());
}
double Cross(Point A,Point B){
    return A.x*B.y-A.y*B.x;
}
void Convex(Point *P,int &T){
    static Point Bp[maxN];
    Point base=P[1];for (int i=2;i<=T;i++) if (P[i].y<base.y||(fabs(P[i].y-base.y)<eps&&P[i].x<base.x)) base=P[i];
    for (int i=1;i<=T;i++) P[i]=P[i]-base;sort(&P[1],&P[T+1],cmpc);
    int top=0;
    for (int i=1;i<=T;i++){
        if (top&&(P[i]-Bp[top]).len()<eps) continue;
        while (top>=2&&Cross(P[i]-Bp[top-1],Bp[top]-Bp[top-1])>=0) --top;
        Bp[++top]=P[i];
    }
    T=top;for (int i=1;i<=top;i++) P[i]=Bp[i]+base;return;
}
bool check(){
    if (n!=m) return 0;
    static double Mh[maxN*4],Ms[maxN*4];
    for (int i=1;i<=n;i++) M1[i+n]=M1[i];
    int cnt1=0,cnt2=0;
    for (int i=1;i<n+n;i++){
        if (i>=2){
            Point p1=M1[i]-M1[i-1],p2=M1[i]-M1[i+1];
            Mh[++cnt1]=p1.angle()-p2.angle();
            if (Mh[cnt1]<0) Mh[cnt1]+=Pi+Pi;
        }
        Mh[++cnt1]=(M1[i+1]-M1[i]).len();
    }
    for (int i=1;i<m;i++){
        if (i>=2){
            Point p1=M2[i]-M2[i-1],p2=M2[i]-M2[i+1];
            Ms[++cnt2]=p1.angle()-p2.angle();
            if (Ms[cnt2]<0) Ms[cnt2]+=Pi+Pi;
        }
        Ms[++cnt2]=(M2[i+1]-M2[i]).len();
    }
    Nxt[1]=Nxt[0]=0;
    for (int i=2,j=0;i<=cnt2;i++){
        while (j&&fabs(Ms[j+1]-Ms[i])>eps) j=Nxt[j];
        if (fabs(Ms[j+1]-Ms[i])<eps) ++j;
        Nxt[i]=j;
    }
    for (int i=1,j=0;i<=cnt1;i++){
        while (j&&fabs(Mh[i]-Ms[j+1])>eps) j=Nxt[j];
        if (fabs(Mh[i]-Ms[j+1])<eps) ++j;
        if (j==cnt2) return 1;
    }
    return 0;
}
```

## F.The Neutral Zone

定义 $\text{exlog}_f(p_1^{a_1}p_2^{a_2}...p_k^{a_2}) = a_1 f(p_1) + a_2 f(p_2) + ... + a_k f(p_k)$，其中 $f(x)=Ax^3+Bx^2+Cx+D$ ，求 $\sum _ {i=1} ^ n \text{exlog}(i)$

min25 筛搞搞就没了。

```cpp
#include<bits/stdc++.h>
using namespace std;

typedef unsigned int uint;
const int maxN=50020;
const int maxK=10;

uint n,srt;uint A,B,C,D;
uint pcnt,notp[maxN+maxN],Pri[maxN+maxN];
uint num,Num[maxN],Id[maxN+maxN];
uint F[4][maxN],Stl[maxK][maxK],Sm[4][maxN];

void Init();
uint GetId(uint X);
uint GetSum(uint r,uint K);
uint QPow(uint x,uint cnt);
pair<uint,uint> S(uint n,uint p);
int main(){
    scanf("%u%u%u%u%u",&n,&A,&B,&C,&D);srt=sqrt(n);
    Init();
    for (uint l=1,r;l<=n;l=r+1){
        r=n/l;Num[++num]=r;for (uint j=0;j<4;j++) F[j][num]=GetSum(r,j)-1;
        if (r<=srt) Id[r]=num;else Id[l+maxN]=num;
        r=n/r;
    }
    
    for (uint i=1;i<=pcnt&&1ll*Pri[i]*Pri[i]<=Num[1];i++)
        for (uint j=1;j<=num&&1ll*Pri[i]*Pri[i]<=Num[j];j++)
            for (uint k=0;k<4;k++)
                F[k][j]=F[k][j]-(F[k][GetId(Num[j]/Pri[i])]-Sm[k][i-1])*QPow(Pri[i],k);
    printf("%u\n",S(n,1).second);return 0;
}
void Init(){
    notp[1]=1;
    for (uint i=2;i<maxN;i++){
        if (!notp[i]){
            Pri[++pcnt]=i;for (uint j=0;j<4;j++) Sm[j][pcnt]=Sm[j][pcnt-1]+QPow(i,j);
        }
        for (uint j=1;j<=pcnt&&1ll*i*Pri[j]<maxN;j++){
            notp[i*Pri[j]]=1;if (i%Pri[j]==0) break;
        }
    }
    Stl[0][0]=1;
    for (uint i=1;i<maxK;i++) for (uint j=1;j<=i;j++) Stl[i][j]=Stl[i-1][j-1]+Stl[i-1][j]*j;
    return;
}
uint GetId(uint X){
    if (X<=srt) return Id[X];
    return Id[n/X+maxN];
}
uint GetSum(uint r,uint K){
    if (K==0) return r;uint ret=0;
    for (uint i=1;i<=min(r,K);i++){
        uint mul=Stl[K][i];bool flag=0;
        for (uint j=r+1;j>r-i;j--)
            if (j%(i+1)==0&&flag==0) mul=mul*(j/(i+1)),flag=1;else mul=mul*j;
        ret=ret+mul;
    }
    return ret;
}
uint QPow(uint x,uint cnt){
    uint ret=1;
    while (cnt){
        if (cnt&1) ret=ret*x;
        x=x*x;cnt>>=1;
    }
    return ret;
}
pair<uint,uint> S(uint n,uint p){
    if (Pri[p]>n||n<=1) return make_pair(0,0);
    uint r1=0,id=GetId(n),r2=0;
    r1=F[0][id]-Sm[0][p-1];
    r2=A*(F[3][id]-Sm[3][p-1])+B*(F[2][id]-Sm[2][p-1])+C*(F[1][id]-Sm[1][p-1])+D*r1;
    for (uint i=p;i<=pcnt&&1ll*Pri[i]*Pri[i]<=n;i++){
        uint bf=A*QPow(Pri[i],3)+B*QPow(Pri[i],2)+C*Pri[i]+D,f=bf;
        for (uint x=Pri[i];1ll*x*Pri[i]<=n;x*=Pri[i],f=f+bf){
            pair<uint,uint> rt=S(n/x,i+1);
            r1+=rt.first;
            r2=r2+rt.second+f*rt.first;
            r1++;r2=r2+f+bf;
        }
    }
    return make_pair(r1,r2);
}
```

## G.The Tree

给定一棵有根树，定义两种操作。一种是对一个点染黑，如果这个点已经是黑色，那么就递归其儿子进行操作；第二种是把某个点的整个子树染白。同时要支持查询某一个点的颜色。

分块，由于一块内涉及到的点的数量不会超过块大小，所以在块内暴力做，做完一块后把信息整合。

```cpp
#include<bits/stdc++.h>
using namespace std;

const int maxN=101000;

int n,Q;
vector<int> T[maxN],Vt[maxN];
pair<int,int> Qn[maxN];
int Mark[maxN],Label[maxN],Dep[maxN],Wht[maxN],Cov[maxN];

void dfs_build(int u,int lst,int wht,int dep);
void dfs_mark(int u);
void dfs_del(int u);
void dfs_rebuild(int u,int cov,int ldep);
int main(){
    scanf("%d%d",&n,&Q);
    for (int i=2;i<=n;i++){
        int fa;scanf("%d",&fa);T[fa].push_back(i);
    }
    for (int i=1;i<=Q;i++) scanf("%d%d",&Qn[i].first,&Qn[i].second);

    int srt=sqrt(Q);
    for (int l=1,r;l<=Q;l=r+1){
        r=min(Q,l+srt-1);
        for (int i=l;i<=r;i++) Mark[Qn[i].second]=1;
        dfs_build(1,0,0,0);
        for (int i=l;i<=r;i++)
            if (Qn[i].first==1) dfs_mark(Qn[i].second);
            else if (Qn[i].first==2) dfs_del(Qn[i].second);
            else Label[Qn[i].second]?puts("black"):puts("white");
        dfs_rebuild(1,0,Cov[1]);
    }
    return 0;
}
void dfs_build(int u,int lst,int wht,int dep){
    if (Mark[u]&&lst){
        Vt[lst].push_back(u);
        Wht[u]=wht;Dep[u]=dep;
    }
    for (int i=0,sz=T[u].size();i<sz;i++)
        if (Mark[u]) dfs_build(T[u][i],u,1,1);
        else dfs_build(T[u][i],lst,wht+(Label[u]==0),dep+1);
    return;
}
void dfs_mark(int u){
    Label[u]++;
    for (int i=0,sz=Vt[u].size();i<sz;i++) if (Label[u]>Wht[Vt[u][i]]) dfs_mark(Vt[u][i]);
    return;
}
void dfs_del(int u){
    Label[u]=0;Cov[u]=1;for (int i=0,sz=Vt[u].size();i<sz;i++) Wht[Vt[u][i]]=Dep[Vt[u][i]],dfs_del(Vt[u][i]);return;
}
void dfs_rebuild(int u,int cov,int ldep){
    cov|=Cov[u];
    if (!Mark[u]) Label[u]=ldep+(Label[u]&&!cov);
    for (int i=0,sz=T[u].size();i<sz;i++) dfs_rebuild(T[u][i],cov,max(0,Label[u]-1));
    Label[u]=(Label[u]>=1);
    Cov[u]=Mark[u]=0;Vt[u].clear();return;
}
```

## H.The Films

给定 $m$ 种书，并给定 $n$ 本类型已经确定的书。现在有若干次询问，每次询问给出 $k,l,r$ ，问若每一种书均加入 $k$ 本，再从中任意选出 $n$ 本，[l,r] 内的书与原来一样的概率。

设某一种书在 $n$ 本中的数量为 $t _ i$，在区间 $[l,r]$ 内的数量为 $c _ i$ ，那么该询问的答案就应该是 $(mk+n-(r-l+1)) ^ {\underline{n-(r-l+1)}}\prod (t _ i+c _ i) ^ {\underline{c _ i}}$ ，离线下来，对于每一种不同的 $K$ 单独跑莫队。

```cpp
#include<bits/stdc++.h>
using namespace std;

const int maxN=101000;

int n,Q;
vector<int> T[maxN],Vt[maxN];
pair<int,int> Qn[maxN];
int Mark[maxN],Label[maxN],Dep[maxN],Wht[maxN],Cov[maxN];

void dfs_build(int u,int lst,int wht,int dep);
void dfs_mark(int u);
void dfs_del(int u);
void dfs_rebuild(int u,int cov,int ldep);
int main(){
    scanf("%d%d",&n,&Q);
    for (int i=2;i<=n;i++){
        int fa;scanf("%d",&fa);T[fa].push_back(i);
    }
    for (int i=1;i<=Q;i++) scanf("%d%d",&Qn[i].first,&Qn[i].second);

    int srt=sqrt(Q);
    for (int l=1,r;l<=Q;l=r+1){
        r=min(Q,l+srt-1);
        for (int i=l;i<=r;i++) Mark[Qn[i].second]=1;
        dfs_build(1,0,0,0);
        for (int i=l;i<=r;i++)
            if (Qn[i].first==1) dfs_mark(Qn[i].second);
            else if (Qn[i].first==2) dfs_del(Qn[i].second);
            else Label[Qn[i].second]?puts("black"):puts("white");
        dfs_rebuild(1,0,Cov[1]);
    }
    return 0;
}
void dfs_build(int u,int lst,int wht,int dep){
    if (Mark[u]&&lst){
        Vt[lst].push_back(u);
        Wht[u]=wht;Dep[u]=dep;
    }
    for (int i=0,sz=T[u].size();i<sz;i++)
        if (Mark[u]) dfs_build(T[u][i],u,1,1);
        else dfs_build(T[u][i],lst,wht+(Label[u]==0),dep+1);
    return;
}
void dfs_mark(int u){
    Label[u]++;
    for (int i=0,sz=Vt[u].size();i<sz;i++) if (Label[u]>Wht[Vt[u][i]]) dfs_mark(Vt[u][i]);
    return;
}
void dfs_del(int u){
    Label[u]=0;Cov[u]=1;for (int i=0,sz=Vt[u].size();i<sz;i++) Wht[Vt[u][i]]=Dep[Vt[u][i]],dfs_del(Vt[u][i]);return;
}
void dfs_rebuild(int u,int cov,int ldep){
    cov|=Cov[u];
    if (!Mark[u]) Label[u]=ldep+(Label[u]&&!cov);
    for (int i=0,sz=T[u].size();i<sz;i++) dfs_rebuild(T[u][i],cov,max(0,Label[u]-1));
    Label[u]=(Label[u]>=1);
    Cov[u]=Mark[u]=0;Vt[u].clear();return;
}
```