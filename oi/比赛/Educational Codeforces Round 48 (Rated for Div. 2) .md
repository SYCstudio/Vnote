# Educational Codeforces Round 48 (Rated for Div. 2) 

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

