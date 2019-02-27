# Train Service Planning
[AGC011F]

在高桥王国中有一条铁路，这条铁路分为$n$个区间$1⋯n$和$n+1$个站台$0⋯n$，区间$i$连接站台$i-1$和$i$  
一列火车经过区间$i$会消耗$A _ i$的时间，每个区间的铁路是双向的或单向的，如果$B _ i=1$那么区间$i$是单向的，否则它是双向的  
现在すぬけ(snuke)君想要设计一个火车时间表，满足以下约定  
所有的火车要么从站台$0$到站台$n$，要么从站台$n$到站台$0$  
对任意终点为$n$的火车，如果它在$t$时刻离开站台$i−1$并开往站台$i$，那么它必须在$t+A _ i$时刻到达$i$站台，对反方向要求相同  
对任意终点为$n$的火车，如果它在$s$时刻到达站台$i$并在$t$时刻离开站台$i$，那么一列经过站台$i$的终点为$n$的火车必须在$s+K$时刻到达站台$i$并在$t+K$时刻离开站台$i$，对反方向要求相同  
在任意时刻不能有两列相向而行的火车在单向区间内互相穿过  
现在你要找出一个时间表，使得一列火车从$0$到$n$和从$n$到$0$的时间之和最短。

不妨设 $p,q$ 分别为第一辆车和第二辆车在每一个车站停车的时间，$P,Q$ 为其对应前缀和。对于某段单向路 $m$ ，两辆车的时间区间分别是 $[\sum  _  {i=1}^{m-1}w  _ i+\sum  _  {i=1}^mp  _  i,\sum  _  {i=1}^mw _ i+\sum  _  {i=1}^mp  _  i]$ 和 $[\sum  _  {i=m+1}^nw _ i+\sum  _  {i=m+1}^nq _ i,\sum  _  {i=m}^nw _ i+\sum  _  {i=m+1}^nq _ i]$ ，后面的式子可以调整为 $[-\sum  _  {i=1}^mw _ i-\sum  _  {i=1}^mq _ i,-\sum  _  {i=1}^{m-1}w _ i-\sum  _  {i=1}^m q _ i]$ 。分别用前缀和可以简写为 $[S _ {m-1}+P _ m,S _ m+P _ m],[-S _ m-Q _ m,-S _ {m-1}-Q _ m]$ 。  
由于是单行道，要求两个区间不相交，即一个区间的端点不在另一个区间内，得到式子 $-2S _ {m-1} \le P _ m+Q _ m \le -2S _ m$，注意到 $S _ m \ge S _ {m-1}$ ，所以这个式子实际上是 $P _ m+Q _ m \not\in (-2S _ m,-2S _ {m-1})$ 。要最小化的就是 $P _ n+Q _ n$ 。  
观察这个模型，发现问题已经转化为，在长度为 $K$ 的区间上走，只能向右走，若跨越了右端点则自动移动回到左端点，每一步都必须走到某个指定区间内。求合法的最小步数。能够不走就不走，要走也只走到左端点。倒着用线段树贪心地维护区间覆盖标记，找到某个区间后面第一个其它的区间。

```cpp
#include<cstdio>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

typedef long long ll;
#define Dct(x) (lower_bound(&Num[1],&Num[num+1],x)-Num)
#define ls (x<<1)
#define rs (ls|1)
const int maxN=101000*5;

int n,K;
ll Sm[maxN],num,Num[maxN],F[maxN],Lft[maxN],Rht[maxN];
int C[maxN<<2];

void Cover(int x,int c);
void PushDown(int x);
void Modify(int x,int l,int r,int ql,int qr,int c);
int Query(int x,int l,int r,int p);
ll Calc(ll pos);
int main(){
    ll sum=0;
    scanf("%d%d",&n,&K);
    for (int i=1;i<=n;i++){
        int key,opt;scanf("%d%d",&key,&opt);
        if (opt==1&&key*2>K){printf("-1\n");exit(0);}
        Sm[i]=(Sm[i-1]+key)%K;sum+=key;
        if (opt==2) Lft[i]=0,Rht[i]=K-1;
        else Lft[i]=(K-Sm[i-1]*2%K)%K,Rht[i]=(K-Sm[i]*2%K)%K;
        Num[++num]=Lft[i];Num[++num]=Rht[i];
    }
    Num[++num]=0;Num[++num]=K-1;sort(&Num[1],&Num[num+1]);num=unique(&Num[1],&Num[num+1])-Num-1;
    for (int i=n;i>=1;i--){
        int l=Dct(Lft[i]),r=Dct(Rht[i]);
        F[i]=Calc(Lft[i]);
        if (l<=r){
            if (l>1) Modify(1,1,num,1,l-1,i);
            if (r<num) Modify(1,1,num,r+1,num,i);
        }
        else if (r+1<=l-1) Modify(1,1,num,r+1,l-1,i);
    }
    ll Ans=F[1];
    for (int i=1;i<=num;i++) Ans=min(Ans,Calc(Num[i]));
    printf("%lld\n",Ans+sum*2);return 0;
}
void PushDown(int x){
    if (C[x]){
        C[ls]=C[x];C[rs]=C[x];
        C[x]=0;
    }
    return;
}
void Modify(int x,int l,int r,int ql,int qr,int c){
    if (l==ql&&r==qr){
        C[x]=c;return;
    }
    int mid=(l+r)>>1;PushDown(x);
    if (qr<=mid) Modify(ls,l,mid,ql,qr,c);
    else if (ql>=mid+1) Modify(rs,mid+1,r,ql,qr,c);
    else Modify(ls,l,mid,ql,mid,c),Modify(rs,mid+1,r,mid+1,qr,c);
    return;
}
int Query(int x,int l,int r,int p){
    if (l==r) return C[x];
    int mid=(l+r)>>1;PushDown(x);
    if (p<=mid) return Query(ls,l,mid,p);
    else return Query(rs,mid+1,r,p);
}
ll Calc(ll pos){
    int p=Dct(pos),id=Query(1,1,num,p);
    if (id==0) return 0;
    return F[id]+(Lft[id]-pos+K)%K;
}
```