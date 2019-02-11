# Codeforces Round #538 (Div. 2)

[link](https://codeforces.com/contest/1114)

## A.Got Any Grapes?

分类讨论模拟模拟。

```cpp
#include<bits/stdc++.h>
using namespace std;

int main(){
    int x,y,z,G,P,B;scanf("%d%d%d%d%d%d",&x,&y,&z,&G,&P,&B);
    G-=x;if (G<0){puts("NO");return 0;}
    int mn=min(G,y);y-=mn;G-=mn;
    P-=y;
    if (P<0||G+P+B<z) puts("NO");
    else puts("YES");return 0;
}
```

## B.Yet Another Array Partitioning Task

贪心地选择序列中前 m*K 大的，因为无论如何选择一定存在合法的分割方式。

```cpp
#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
const int maxN=202000;

int n,m,K;
pair<ll,int> Seq[maxN];
bool vis[maxN];

int main(){
    scanf("%d%d%d",&n,&m,&K);
    for (int i=1;i<=n;i++) scanf("%lld",&Seq[i].first),Seq[i].second=i;
    sort(&Seq[1],&Seq[n+1]);reverse(&Seq[1],&Seq[n+1]);
    ll Ans=0;
    for (int i=1;i<=m*K;i++) Ans+=Seq[i].first,vis[Seq[i].second]=1;
    printf("%lld\n",Ans);
    int tot=0;
    for (int i=1,cnt=0;i<=n;i++){
        cnt+=vis[i];
        if (cnt==m){
            ++tot;if (tot==K) break;
            printf("%d ",i);cnt=0;
        }
    }
    printf("\n");return 0;
}
```

## C.Trailing Loves (or L'oeufs?)

考虑如何凑出 B ，即对 B 质因数分解，求出 n 阶乘中该因子的出现次数/B 中出现次数，所有质因子取 min 即为答案。

```cpp
#include<bits/stdc++.h>
using namespace std;

typedef unsigned long long ll;

ll Calc(ll n,ll x);
int main(){
    ll n,B;cin>>n>>B;
    ll Ans=1e18;
    ll fB=B;
    for (ll i=2;(double)i*(double)i<=fB;i++)
        if (fB%i==0){
            ll cnt=Calc(n,i);ll count=0;
            while (fB%i==0) fB/=i,++count;
            Ans=min(Ans,cnt/count);
        }
    if (fB!=1){
        ll cnt=Calc(n,fB);
        Ans=min(Ans,cnt);
    }
    cout<<Ans<<endl;
    return 0;
}
ll Calc(ll n,ll x){
    ll ret=0;
    for (ll i=n;i;i/=x) ret+=i/x;
    return ret;
}
```

## D.Flood Fill

区间 DP ，设 F[l][r][0/1] 表示区间 [l,r] ，颜色为 C[l]/C[r] 的最小操作次数。

```cpp
#include<bits/stdc++.h>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
const int maxN=5010;
int n,Col[maxN];
int F[maxN][maxN][2];

int c(int l,int r){return Col[l]!=Col[r];}
int main(){
    scanf("%d",&n);for (int i=1;i<=n;i++) scanf("%d",&Col[i]);
    mem(F,63);
    for (int i=1;i<=n;i++) F[i][i][0]=F[i][i][1]=0;
    for (int len=1;len<n;len++)
        for (int l=1;l+len-1<=n;l++)
            for (int b=0;b<=1;b++){
                int r=l+len-1,p=(b?r:l);
                if (l>1) F[l-1][r][0]=min(F[l-1][r][0],F[l][r][b]+c(l-1,p));
                if (r<n) F[l][r+1][1]=min(F[l][r+1][1],F[l][r][b]+c(r+1,p));
            }
    printf("%d\n",min(F[1][n][0],F[1][n][1]));return 0;
}
```

## E.Arithmetic Progression

首先通过 $\log$ 次二分找到最大的值，然后随机询问若干位置，两两作差求 gcd 即为公差。

```cpp
#include<bits/stdc++.h>
using namespace std;

int make(int l,int r);

int main(){
    srand(20020622);
    int n;scanf("%d",&n);int cnt=60;
    int l=0,r=1e9,mx=0;
    while (l<=r){
        int mid=(l+r)>>1;
        cout<<"> "<<mid<<endl;fflush(stdout);
        int b;cin>>b;--cnt;
        if (b) l=mid+1;
        else mx=mid,r=mid-1;
    }
    int d=0;
    int Seq[50];Seq[0]=mx;
    for (int i=1;i<=cnt;i++){
        int p=make(1,n);
        cout<<"? "<<p<<endl;fflush(stdout);
        cin>>Seq[i];
        for (int j=0;j<i;j++) d=__gcd(d,abs(Seq[i]-Seq[j]));
    }
    printf("! %d %d\n",mx-(n-1)*d,d);return 0;
}
int make(int l,int r){
    double dou=1.0*rand()/RAND_MAX;
    return min(r,(int)(dou*(r-l+1))+l);
}
```

## F.Please, another Queries on Array?

小于等于 300 的质数只有 62 个，拿个 long long 压起来，维护区间 or 和以及区间乘积。

```cpp
#include<bits/stdc++.h>
using namespace std;

#define ls (x<<1)
#define rs (ls|1)
#define mid ((l+r)>>1)
typedef long long ll;
const int maxN=404000;
const int Mod=1e9+7;
const int maxNum=302;

int notprime[maxN],pcnt,P[maxN];
int n,Q;
int S[maxN<<2],Mul[maxN<<2],Sz[maxN<<2];
ll Bs[maxN<<2],Or[maxN<<2];
int Inv[maxN];

void Init();
int QPow(int x,int cnt);
void Build(int x,int l,int r);
void Update(int x);
void PushDown(int x);
void RMul(int x,int key);
void ROr(int x,ll s);
void Modify(int x,int l,int r,int ql,int qr,int key,ll ns);
int Query(int x,int l,int r,int ql,int qr);
ll GetOr(int x,int l,int r,int ql,int qr);

int main(){
    Init();
    scanf("%d%d",&n,&Q);
    Build(1,1,n);
    while (Q--){
        char ipt[20];int l,r,x;scanf(" %s %d%d",ipt,&l,&r);
        if (ipt[0]=='M'){
            scanf("%d",&x);
            ll ns=0;for (int i=0;i<=pcnt;i++) if (x%P[i]==0) ns|=(1ll<<i);
            Modify(1,1,n,l,r,x,ns);
        }
        else{
            int Ans=Query(1,1,n,l,r);ll s=GetOr(1,1,n,l,r);
            for (int i=0;i<=pcnt;i++) if (s&(1ll<<i)) Ans=1ll*Ans*Inv[i]%Mod;
            printf("%d\n",Ans);
        }
    }
    return 0;
}
void Init(){
    notprime[1]=1;
    for (int i=2;i<maxNum;i++){
        if (notprime[i]==0) P[++pcnt]=i;
        for (int j=1;j<=pcnt&&1ll*i*P[j]<maxNum;j++){
            notprime[i*P[j]]=1;
            if (i%P[j]==0) break;
        }
    }
    for (int i=0;i<pcnt;i++) P[i]=P[i+1];--pcnt;
    for (int i=0;i<=pcnt;i++) Inv[i]=1ll*(P[i]-1)*QPow(P[i],Mod-2)%Mod;
}
int QPow(int x,int cnt){
    int ret=1;
    while (cnt){
        if (cnt&1) ret=1ll*ret*x%Mod;
        x=1ll*x*x%Mod;cnt>>=1;
    }
    return ret;
}
void Build(int x,int l,int r){
    Or[x]=0;Mul[x]=1;Sz[x]=r-l+1;
    if (l==r){
        scanf("%d",&S[x]);
        for (int i=0;i<=pcnt;i++) if (S[x]%P[i]==0) Bs[x]|=1ll<<i;
        return;
    }
    Build(ls,l,mid);Build(rs,mid+1,r);
    Update(x);return;
}
void Update(int x){
    S[x]=1ll*S[ls]*S[rs]%Mod;
    Bs[x]=Bs[ls]|Bs[rs];return;
}
void PushDown(int x){
    if (Mul[x]!=1){
        RMul(ls,Mul[x]);RMul(rs,Mul[x]);
        Mul[x]=1;
    }
    if (Or[x]){
        ROr(ls,Or[x]);ROr(rs,Or[x]);
        Or[x]=0;
    }
    return;
}
void RMul(int x,int key){
    S[x]=1ll*S[x]*QPow(key,Sz[x])%Mod;Mul[x]=1ll*Mul[x]*key%Mod;
    return;
}
void ROr(int x,ll s){
    Bs[x]|=s;Or[x]|=s;return;
}
void Modify(int x,int l,int r,int ql,int qr,int key,ll ns){
    if (l==ql&&r==qr){
        RMul(x,key);ROr(x,ns);return;
    }
    PushDown(x);
    if (qr<=mid) Modify(ls,l,mid,ql,qr,key,ns);
    else if (ql>=mid+1) Modify(rs,mid+1,r,ql,qr,key,ns);
    else Modify(ls,l,mid,ql,mid,key,ns),Modify(rs,mid+1,r,mid+1,qr,key,ns);
    Update(x);return;
}
int Query(int x,int l,int r,int ql,int qr){
    if (l==ql&&r==qr) return S[x];
    PushDown(x);
    if (qr<=mid) return Query(ls,l,mid,ql,qr);
    else if (ql>=mid+1) return Query(rs,mid+1,r,ql,qr);
    else return 1ll*Query(ls,l,mid,ql,mid)*Query(rs,mid+1,r,mid+1,qr)%Mod;
}
ll GetOr(int x,int l,int r,int ql,int qr){
    if (l==ql&&r==qr) return Bs[x];
    PushDown(x);
    if (qr<=mid) return GetOr(ls,l,mid,ql,qr);
    else if (ql>=mid+1) return GetOr(rs,mid+1,r,ql,qr);
    else return GetOr(ls,l,mid,ql,mid)|GetOr(rs,mid+1,r,mid+1,qr);
}
```