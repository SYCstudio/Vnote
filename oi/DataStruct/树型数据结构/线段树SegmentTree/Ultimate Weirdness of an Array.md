# Ultimate Weirdness of an Array
[CF671C]

$n \le 200000$个$\le 200000$的数问所有的$f(i,j)$的和，$f(i,j)$表示去掉区间$i$到$j$后的剩余的数字中任选两个数的最大$gcd$

注意到数的值域不大，考虑如何得到每一个 gcd 出现的次数。  
求一个 i 作为 gcd 出现的区间并不好求，那么考虑求 gcd 小于等于  i 的区间个数。从大往小做。设 next[i] 表示 i 后面第一个满足上述式子的位置，那么 d 的答案就是对应 $\sum n-next[i]+1$ 的和。考虑当枚举的数由 i 变成 i-1 时， next 会如何变化。先预处理出含有 i 作为约数的所有数的位置，如果这些数不超过 1 个，那么对答案不会有影响；否则，假设有 m 个这样的数，要求所有的区间都至少包含 m-1 个这样的数才合法。计前两个和后两个分别为 x1,x2,xm,xm-1 ，那么 [1,x1] 的 next 都要与 xm-1 取 max，(x1,x2] 的都要与 xm 取 max ,(x2,n] 的都要与 n+1 取 max 。这些操作都可以用线段树来维护。

```cpp
#include<cstdio>
#include<cstring>
#include<cstdlib>
#include<algorithm>
#include<vector>
#include<iostream>
using namespace std;

#define ls (x<<1)
#define rs (ls|1)
typedef long long ll;
const int maxN=202000;
class SegmentData{
    public:
    ll sum;int sz,cov,mx,mn;
};

int n;
int Seq[maxN];
vector<int> P[maxN];
ll Pf[maxN];
SegmentData S[maxN<<2];

void Update(int x);
void Cover(int x,int c);
void PushDown(int x);
void Build(int x,int l,int r);
void Rc(int x,int l,int r,int ql,int qr,int c);
void Mx(int x,int l,int r,int ql,int qr,int c);
int main(){
    int mx=0;
    scanf("%d",&n);for (int i=1;i<=n;i++) scanf("%d",&Seq[i]),mx=max(mx,Seq[i]);
    for (int i=1;i<=n;i++)
        for (int j=1;1ll*j*j<=Seq[i];j++)
            if (Seq[i]%j==0){
                P[j].push_back(i);
                if (Seq[i]/j!=j) P[Seq[i]/j].push_back(i);
            }
    Build(1,1,n);
    for (int i=mx;i>=1;i--){
        Pf[i]=1ll*(n+1)*n-S[1].sum;
        if (P[i].size()<=1) continue;
        int sz=P[i].size()-1,x1=P[i][0],x2=P[i][1],xn=P[i][sz],xn2=P[i][sz-1];
        Mx(1,1,n,1,x1,xn2);
        Mx(1,1,n,x1+1,x2,xn);
        if (x2+1<=n) Mx(1,1,n,x2+1,n,n+1);
    }
    Pf[0]=1ll*(n+1)*n-S[1].sum;
    ll Ans=0;
    for (int i=1;i<=mx;i++) Ans=Ans+(Pf[i]-Pf[i-1])*i;
    printf("%lld\n",Ans);return 0;
}
void Update(int x){
    S[x].sum=S[ls].sum+S[rs].sum;
    S[x].mx=max(S[ls].mx,S[rs].mx);
    S[x].mn=min(S[ls].mn,S[rs].mn);
    return;
}
void Cover(int x,int c){
    S[x].cov=S[x].mx=S[x].mn=c;S[x].sum=1ll*S[x].sz*c;return;
}
void PushDown(int x){
    if (S[x].cov){
        Cover(ls,S[x].cov);Cover(rs,S[x].cov);S[x].cov=0;
    }
    return;
}
void Build(int x,int l,int r){
    S[x].sz=r-l+1;
    if (l==r){
        S[x].mn=S[x].mx=S[x].sum=l;return;
    }
    int mid=(l+r)>>1;Build(ls,l,mid);Build(rs,mid+1,r);
    Update(x);return;
}
void Rc(int x,int l,int r,int ql,int qr,int c){
    if (l==ql&&r==qr){
        Cover(x,c);return;
    }
    int mid=(l+r)>>1;PushDown(x);
    if (qr<=mid) Rc(ls,l,mid,ql,qr,c);
    else if (ql>=mid+1) Rc(rs,mid+1,r,ql,qr,c);
    else Rc(ls,l,mid,ql,mid,c),Rc(rs,mid+1,r,mid+1,qr,c);
    Update(x);return;
}
void Mx(int x,int l,int r,int ql,int qr,int c){
    if (l==ql&&r==qr){
        if (S[x].mn>=c) return;
        if (S[x].mx<=c){
            Cover(x,c);return;
        }
    }
    int mid=(l+r)>>1;PushDown(x);
    if (qr<=mid) Mx(ls,l,mid,ql,qr,c);
    else if (ql>=mid+1) Mx(rs,mid+1,r,ql,qr,c);
    else Mx(ls,l,mid,ql,mid,c),Mx(rs,mid+1,r,mid+1,qr,c);
    Update(x);return;
}
```