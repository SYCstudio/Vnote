# Educational Codeforces Round 48 (Rated for Div. 2)(VP)
[link](http://codeforces.com/contest/1016)

## A.Death Note

给定一本无限厚，每一页行数为 $m$ 的书，接下来 $n$ 天，每天要写 $A _ i$ 行，求每天翻页的次数。

模拟。

```cpp
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;

int main(){
    int n,m;scanf("%d%d",&n,&m);
    ll sum=0,cnt=0;
    for (int i=1;i<=n;i++){
        ll x;scanf("%lld",&x);
        sum+=x;ll c=sum/m;
        printf("%lld ",c-cnt);cnt=c;
    }
    return 0;
}
```

## B.Segment Occurrences

给定两个字符串 A,B ，现在有 $Q$ 次询问，每次询问给定一个区间 [l,r] ，求 A 在 B[l,r] 中出现了多少次。

KMP

```cpp
#include<bits/stdc++.h>
using namespace std;

const int maxN=1010;

int n,m,Q;
char S[maxN],T[maxN];
int Nxt[maxN],Mch[maxN];

int main(){
    scanf("%d%d%d",&n,&m,&Q);scanf("%s",S+1);scanf("%s",T+1);
    Nxt[0]=Nxt[1]=0;
    for (int i=2,j=0;i<=m;i++){
        while (j&&T[j+1]!=T[i]) j=Nxt[j];
        if (T[j+1]==T[i]) ++j;Nxt[i]=j;
    }
    for (int i=1,j=0;i<=n;i++){
        while (j&&T[j+1]!=S[i]) j=Nxt[j];
        if (T[j+1]==S[i]) ++j;
        if (j==m) Mch[i]=1,j=Nxt[j];
        Mch[i]+=Mch[i-1];
    }
    while (Q--){
        int l,r;scanf("%d%d",&l,&r);l+=m-1;
        if (l>r) puts("0");else printf("%d\n",Mch[r]-Mch[l-1]);
    }
    return 0;
}
```

## C.Vasya And The Mushrooms

给定 $2 \times n$ 个格子，每个格子里有蘑菇，给定每格中蘑菇的生长速度，现在从左上角出发，补充不漏的经过所有的格子，中间不作停留，到达某个格子是会采集格子内的所有蘑菇。求最多能采多少蘑菇。

定存在一个分界线，左边的走法是一直上下移动，右边的走法则是横着的直线。从左往右枚举分割线的位置，右边的代价可以提前预处理。

```cpp
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;

const int maxN=303000;

int n;
ll Mt[2][maxN],Sm1[2][maxN],Sm2[2][maxN],Sm3[2][maxN];

int main(){
    scanf("%d",&n);
    for (int j=0;j<=1;j++) for (int i=1;i<=n;i++) scanf("%lld",&Mt[j][i]);
    for (int i=n;i>=1;i--)
        for (int j=0;j<=1;j++){
            Sm1[j][i]=Sm1[j][i+1]+Mt[j][i];
            Sm2[j][i]=Sm2[j][i+1]+Sm1[j][i];
            Sm3[j][i]=Sm3[j][i+1]+Mt[j][i]*(n-i+1);
        }
    ll Ans=0,sum=0;
    for (int i=1;i<=n;i++)
        if (i&1){
            Ans=max(Ans,sum+Sm2[0][i]+Sm3[1][i]+Sm1[0][i]*(i-1+i-1)+Sm1[1][i]*(i-1+n));
            Ans=max(Ans,sum+Sm3[0][i+1]+Sm2[1][i+1]+Sm1[0][i+1]*(n+i)+Sm1[1][i+1]*(i+i)+Mt[0][i]*(i-1+i)+Mt[1][i]*(i+i));
            sum=sum+Mt[0][i]*(i-1+i)+Mt[1][i]*(i+i);
        }
        else{
            Ans=max(Ans,sum+Sm3[0][i]+Sm2[1][i]+Sm1[0][i]*(i-1+n)+Sm1[1][i]*(i-1+i-1));
            Ans=max(Ans,sum+Sm2[0][i+1]+Sm3[1][i+1]+Sm1[0][i+1]*(i+i)+Sm1[1][i+1]*(n+i)+Mt[0][i]*(i+i)+Mt[1][i]*(i-1+i));
            sum=sum+Mt[0][i]*(i+i)+Mt[1][i]*(i-1+i);
        }
    Ans=max(Ans,sum);
    Ans=Ans-Sm1[0][1]-Sm1[1][1];
    printf("%lld\n",Ans);return 0;
}
```

## D.Vasya And The Matrix

给定长度分别为 $n,m$ 的序列 $A,B$ ，要求构造一个 $n \times m$ 的矩阵，满足第 $i$ 行异或之和为 $A _ i$ ，第 $i$ 列异或之和为 $B _ i$ 。

异或是位不相关的，所以可以拆成每一位考虑。首先把行列为 1 的一一对应匹配，如果剩下的 1 为奇数，那么一定无解，否则全部塞到任意一行，不影响奇偶性。

```cpp
#include<bits/stdc++.h>
using namespace std;

#define pw(x) (1<<(x))
const int maxN=110;

int n,m;
int A[maxN],B[maxN],C1[maxN],C2[maxN];
int Ans[maxN][maxN];

void IMP();
int main(){
    scanf("%d%d",&n,&m);for (int i=1;i<=n;i++) scanf("%d",&A[i]);for (int i=1;i<=m;i++) scanf("%d",&B[i]);
    for (int b=31;b>=0;b--){
        int cnt1=0,cnt2=0;
        for (int i=1;i<=n;i++) if (A[i]&pw(b)) C1[++cnt1]=i;
        for (int i=1;i<=m;i++) if (B[i]&pw(b)) C2[++cnt2]=i;
        int mnc=min(cnt1,cnt2);
        for (int i=1;i<=mnc;i++) Ans[C1[i]][C2[i]]|=pw(b);
        if (cnt1>mnc){
            if ((cnt1-mnc)&1) IMP();
            for (int i=mnc+1;i<=cnt1;i++) Ans[C1[i]][1]|=pw(b);
        }
        if (cnt2>mnc){
            if ((cnt2-mnc)&1) IMP();
            for (int i=mnc+1;i<=cnt2;i++) Ans[1][C2[i]]|=pw(b);
        }
    }
    puts("YES");
    for (int i=1;i<=n;i++){
        for (int j=1;j<=m;j++) printf("%d ",Ans[i][j]);printf("\n");
    }
    return 0;
}
void IMP(){
    puts("NO");exit(0);
}
```

## E.Rest In The Shades

给定平面直角坐标系 x 轴下方一条与 X 平行的线段 AB ，同时给定 x 轴上若干不相交的线段。现在有若干次询问，每次询问给出 x 轴上方一点，求以这个点为中心做 x 轴上线段的投影到 AB 上，投影的长度之和。

由相似三角形的相关知识，若下方的 AB无限制，那么投影的长度只和原来的长度与现在的高度比例有关。那么二分找出左右端点，中间的直接前缀和优化，两边零散的单独算。

```cpp
#include<bits/stdc++.h>
using namespace std;

typedef double ld;
const int maxN=202000;
const ld eps=1e-11;

int n,Q;
ld Sy,A,B;
ld L[maxN],R[maxN],Sm[maxN];

ld GetX(ld x1,ld y1,ld x2,ld y2,ld y);
int main(){
    scanf("%lf%lf%lf",&Sy,&A,&B);scanf("%d",&n);
    for (int i=1;i<=n;i++) scanf("%lf%lf",&L[i],&R[i]),Sm[i]=Sm[i-1]+R[i]-L[i];
    scanf("%d",&Q);
    while (Q--){
        ld tx,ty;scanf("%lf%lf",&tx,&ty);
        ld lx=GetX(tx,ty,A,Sy,0),rx=GetX(tx,ty,B,Sy,0);
        if (lx>R[n]||rx<L[1]){
            puts("0");continue;
        }
        lx=max(lx,L[1]);rx=min(rx,R[n]);
        int l,r,p1=0,p2=n+1;
        l=1;r=n;
        while (l<=r){
            int mid=(l+r)>>1;
            if (lx<=R[mid]) p1=mid,r=mid-1;
            else l=mid+1;
        }
        l=1;r=n;
        while (l<=r){
            int mid=(l+r)>>1;
            if (rx>=L[mid]) p2=mid,l=mid+1;
            else r=mid-1;
        }
        if (p1>p2){
            puts("0");continue;
        }
        ld Ans=0;lx=max(lx,L[p1]);rx=min(rx,R[p2]);
        if (p1==p2) Ans=(rx-lx)*(ty-Sy)/ty;
        else{
            Ans=Sm[p2-1]-Sm[p1];
            if (p1>=1) Ans+=R[p1]-lx;
            if (p2<=n) Ans+=rx-L[p2];
            Ans*=(ty-Sy)/ty;
        }
        printf("%.11lf\n",Ans);
    }
    return 0;
}
ld GetX(ld x1,ld y1,ld x2,ld y2,ld y){
    if (fabs(x1-x2)<eps) return x1;
    ld k=(y1-y2)/(x1-x2),b=y1-k*x1;
    return (y-b)/k;
}
```

## F.Road Projects

给定一棵有边权的树，现在有若干次询问，每次询问给出一个距离 $d$ ，要求在树上加一条不会造成重边自环的长度为 $d$ 的边，使得 1 到 n 的最短路尽量长。

把 1-n 的链提出来，剩下的挂在下面。首先，长度绝不会小于原树上距离的情况有两种，某个点有超过 1 个儿子，或者某个子树内深度超过 1，这样新加的边一定可以不对原来造成影响。否则的话，设 $s _ i$ 为 1-n 链上前缀和，那么替换的代价应该就是 $d _ u + d _ v-(s _ j-s _ i)$ ，拆分成两边维护，最后取 max。

```cpp
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
const int maxN=303000;
const int maxM=maxN<<1;
const ll INF=1e18;

int n,m;
int ecnt=-1,Hd[maxN],Nt[maxM],V[maxM],W[maxM],Fa[maxN];
int Seq[maxN],Mk[maxN];
ll Mx=-INF,Pre=-INF,Sm[maxN];

void Add_Edge(int u,int v,int w);
void dfs(int u,int fa);
void dfs1(int u,int fa,ll sum,int dep);
void dfs2(int u,int fa,ll sum);
int main(){
    scanf("%d%d",&n,&m);memset(Hd,-1,sizeof(Hd));
    for (int i=1;i<n;i++){
        int u,v,w;scanf("%d%d%d",&u,&v,&w);
        Add_Edge(u,v,w);Add_Edge(v,u,w);
    }
    dfs(1,0);
    int now=n,scnt=0;while (now) Mk[Seq[++scnt]=now]=1,now=Fa[now];
    reverse(&Seq[1],&Seq[scnt+1]);
    for (int i=1;i<=scnt;i++){
        Mx=max(Mx,Pre-Sm[Seq[i]]);
        if (i>=2) Pre=max(Pre,Sm[Seq[i-1]]);int cnt=0;
        for (int j=Hd[Seq[i]];j!=-1;j=Nt[j]) if (!Mk[V[j]]) dfs1(V[j],Seq[i],W[j]-Sm[Seq[i]],1),++cnt;
        if (cnt>=2) Mx=max(Mx,INF);
        for (int j=Hd[Seq[i]];j!=-1;j=Nt[j]) if (!Mk[V[j]]) dfs2(V[j],Seq[i],W[j]+Sm[Seq[i]]);
    }
    while (m--){
        int X;scanf("%d",&X);
        printf("%lld\n",min(Sm[Seq[scnt]],Sm[Seq[scnt]]+X+Mx));
    }
    return 0;
}
void Add_Edge(int u,int v,int w){
    Nt[++ecnt]=Hd[u];Hd[u]=ecnt;V[ecnt]=v;W[ecnt]=w;return;
}
void dfs(int u,int fa){
    for (int i=Hd[u];i!=-1;i=Nt[i]) if (V[i]!=fa) Fa[V[i]]=u,Sm[V[i]]=Sm[u]+W[i],dfs(V[i],u);return;
}
void dfs1(int u,int fa,ll sum,int dep){
    Mx=max(Mx,Pre+sum);int cnt=0;if (dep>=2) Mx=max(Mx,INF);
    for (int i=Hd[u];i!=-1;i=Nt[i]) if (V[i]!=fa) dfs1(V[i],u,sum+W[i],dep+1),++cnt;
    if (cnt>=2) Mx=max(Mx,INF);
    return;
}
void dfs2(int u,int fa,ll sum){
    Pre=max(Pre,sum);
    for (int i=Hd[u];i!=-1;i=Nt[i]) if (V[i]!=fa) dfs2(V[i],u,sum+W[i]);
    return;
}
```

## G.Appropriate Team

给定两个整数 $X,Y$ 和整数数列 $A _ i$ ，求有多少对 $i,j$ 满足存在一个 $v$ 使得 $\gcd(v,A _ i)=X,\mbox{lcm}(v,A _ j)=Y$ 。

注意到 $i,j$ 首先要满足的性质是 $X|A _ i,A _ j|Y$ ，由于 $Y \le 10^18$ ，所以 Y 分解质因数不会超过 15 项，使用 $PollardRho+MillerRabin$ 分解。设 $x _ k,y _ k$ 分别为 $X,Y$ 中第 $k$ 个质因子的指数，同理有 $A _ {i,k},v _ k$ ，有如下讨论。

当 $A _ {i,k} = x _ k$ 时，此时仅要求 $A _ {j,k} \le y _ k$ 即可；当 $A _ {i,k} < x _ k$ 时，此时要求 $v _ k=x _ k$，若 $x _ k=y _ k$ ，则 $A _ {j,k} \le y _ k$，否则 $A _ {j,k} =y _ k$ 。综上，当 $A _ {i,k}=x _ k$ 或 $x _ k=y _ k$ 时，$A _ {j,k} \le y _ k$ ，否则 $A _ {j,k} = y _ k$ 。  
把上述压成二进制状态，对所有满足 $A _ j|Y$ 的 $A _ j$　分解，若　$A _ {j,k}=y _ k$，则该位状态为 1 ，否则为 0 ，这样可以得到一个二进制状态。再考虑枚举 $A _ i$ 计算合法的 $j$ 的数量，同样也是质因数分解，得到二进制状态 S ，而合法的能贡献这个 S 的状态是 S 的超集，处理高维后缀和得解。

```cpp
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
typedef long double ld;
#define pw(x) (1<<(x))

const int maxN=202000;
const int maxP=15;

ll X,Y,A[maxN];int n,Cnt[pw(maxP)+10];
vector<ll> Fcy,Pfy;
vector<pair<int,int> > Pfxy;

ll Mul(ll A,ll B,ll Mod);
ll QPow(ll A,ll cnt,ll Mod);
void Fc(ll X,vector<ll> & V);
ll random(ll l,ll r);
bool MillerRabin(ll X);
ll PollardRho(ll X);
int main(){
    srand(20150622);scanf("%d%lld%lld",&n,&X,&Y);
    if (Y%X) return puts("0"),0;
    Fc(Y,Fcy);sort(Fcy.begin(),Fcy.end());
    for (int i=0,sz=Fcy.size();i<sz;i++)
        if (Pfy.empty()||Fcy[i]!=Pfy.back()) Pfy.push_back(Fcy[i]),Pfxy.push_back(make_pair(0,1));
        else ++Pfxy.back().second;
    ll H=X;int psz=Pfy.size(),N=pw(psz);
    for (int i=0;i<psz;i++) while (H%Pfy[i]==0) ++Pfxy[i].first,H/=Pfy[i];
    for (int i=1;i<=n;i++) scanf("%lld",&A[i]);
    for (int i=1;i<=n;i++){
        if (Y%A[i]) continue;
        int S=0;ll H=A[i];
        for (int j=0;j<psz;j++){
            int c=0;while (H%Pfy[j]==0) ++c,H/=Pfy[j];
            if (c==Pfxy[j].second) S|=pw(j);
        }
        ++Cnt[S];
    }
    for (int i=0;i<psz;i++) for (int S=0;S<N;S++) if (!(S&pw(i))) Cnt[S]+=Cnt[S^pw(i)];
    ll Ans=0;
    for (int i=1;i<=n;i++){
        if (A[i]%X) continue;
        int S=N-1;ll H=A[i];
        for (int j=0;j<psz;j++){
            int c=0;while (H%Pfy[j]==0) ++c,H/=Pfy[j];
            if (c==Pfxy[j].first||Pfxy[j].first==Pfxy[j].second) S^=pw(j);
        }
        Ans=Ans+Cnt[S];
    }
    printf("%lld\n",Ans);return 0;
}
ll Mul(ll A,ll B,ll Mod){
    return (A*B-(ll)((ld)A/Mod*(ld)B+0.5)*Mod+Mod)%Mod;
}
ll QPow(ll A,ll cnt,ll Mod){
    ll ret=1;
    while (cnt){
        if (cnt&1) ret=Mul(ret,A,Mod);
        cnt>>=1;A=Mul(A,A,Mod);
    }
    return ret;
}
ll random(ll l,ll r){
    ld dou=1.0*rand()/RAND_MAX;
    return min(r,(ll)(dou*(r-l+1)+l));
}
bool MillerRabin(ll X){
    static int pcnt=10,P[]={2,3,5,7,11,13,17,19,23,29};
    for (int i=0;i<pcnt;i++){
        if (X<=P[i]) continue;
        if (QPow(P[i],X-1,X)!=1) return 0;
        ll dx=X-1;
        while (~dx&1){
            dx>>=1;ll dt=QPow(P[i],dx,X);
            if (Mul(dt,dt,X)==1&&dt!=1&&dt!=X-1) return 0;
        }
    }
    return 1;
}
ll PollardRho(ll X){
    ll x=0,y=0,a=random(1,X-1),b=2,g=1;
    while (1){
        ll mul=1;y=x;
        for (int i=1;i<b;i++){
            y=(Mul(y,y,X)+a)%X;
            mul=Mul(mul,abs(y-x),X);
            if (!(i&127)){
                g=__gcd(mul,X);
                if (g>1) return g;
            }
        }
        b<<=1;x=y;
        if (g>1||(g=__gcd(mul,X))>1) break;
    }
    if (g==X) g=1;return g;
}
void Fc(ll X,vector<ll> &V){
    if (MillerRabin(X)) V.push_back(X);
    else{
        ll g=1;
        while (g==1||g==X) g=PollardRho(X);
        Fc(g,V);Fc(X/g,V);
    }
    return;
}
```