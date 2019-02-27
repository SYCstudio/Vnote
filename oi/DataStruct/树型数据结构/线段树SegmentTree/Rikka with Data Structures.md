# Rikka with Data Structures
[CFGym102012E]

As we know, Rikka is poor at data structures. Yuta is worrying about this situation, so he gives Rikka some tasks about data structures to practice. Here is one of them:  
Yuta has an array 𝐴 with 𝑛 numbers, denoted by 𝐴[1],𝐴[2],⋯,𝐴[𝑛]. Then he makes 𝑚 operations on it.  
There are three types of operations:  
1 l r k: for each index 𝑖 in [𝑙,𝑟], change the value of 𝐴[𝑖] into (𝐴[𝑖]+𝑘);  
2 l r k: for each index 𝑖 in [𝑙,𝑟], change the value of 𝐴[𝑖] into 𝑘;  
3 l r x: Yuta wants Rikka to count the number of different indices 𝑦 with 𝑙≤𝑦≤𝑟 such that max{𝐴[min{𝑥,𝑦}],𝐴[min{𝑥,𝑦}+1],⋯,𝐴[max{𝑥,𝑦}]}=max{𝐴[𝑥],𝐴[𝑦]}.  
It is too difficult for Rikka. Can you help her?

只考虑需要处理 x<l<=r 的情况。分析询问，要求区间最大值不能超过端点最大值的区间个数。那么对于端点最大值是取 x 还是取 y 讨论。先求出 [x,l) 的最大值 mx 。若 $mx \le A[x]$ ，则二分找到区间中第一个大于 A[x] 的位置，此位置之前均能与 x 形成答案，此位置之后则应该是前缀 mx 的数量；否则，二分找到区间中第一个大于等于 mx 的位置，要求的便是此位置之后是前缀 mx 的数量。这些信息都可以用线段树来维护。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

typedef long long ll;
#define ls (x<<1)
#define rs (ls|1)
#define mid ((l+r)>>1)
const int maxN=101000;
class SegmentData{
    public:
    ll mx,cnt,pls,cov,sz,tmx,tcnt;
};
int n,Input[maxN];
class SegmentTree{
    public:
    SegmentData S[maxN<<2];
    int Get(int x,int l,int r,int ql,int qr,ll limit){
        if (l==ql&&r==qr) S[x].tcnt=S[x].cnt,S[x].tmx=S[x].mx;
        if (S[x].tmx<limit) return 0;
        if (l==r) return 1;
        PushDown(x);
        if (l<=mid&&r>mid){
            if (ql<=l&&qr>=mid) S[ls].tmx=S[ls].mx,S[ls].tcnt=S[ls].cnt;
            if (S[ls].tmx>=limit) return Get(ls,l,mid,ql,mid,limit)+S[x].tcnt-S[ls].tcnt;
            else return Get(rs,mid+1,r,mid+1,qr,limit);
        }
        if (qr<=mid) return Get(ls,l,mid,ql,qr,limit);
        else return Get(ls,l,mid,ql,mid,limit);
    }
    void Update(int x,int l,int r){
        S[x].mx=max(S[ls].mx,S[rs].mx);
        S[x].cnt=S[ls].cnt+Get(rs,mid+1,r,mid+1,r,S[ls].mx);
        S[x].tmx=S[x].mx;S[x].tcnt=S[x].cnt;
        return;
    }
    void Build(int x,int l,int r){
        S[x].mx=S[x].cnt=S[x].pls=S[x].cov=S[x].sz=S[x].tmx=S[x].tcnt=0;
        S[x].sz=r-l+1;
        if (l==r){
            S[x].mx=Input[l];S[x].cnt=1;
            return;
        }
        Build(ls,l,mid);Build(rs,mid+1,r);Update(x,l,r);return;
    }
    void Cover(int x,ll k){
        S[x].mx=k;S[x].cnt=S[x].sz;S[x].pls=0;S[x].cov=k;
        return;
    }
    void Plus(int x,ll k){
        S[x].mx+=k;
        if (S[x].cov) S[x].cov+=k;
        else S[x].pls+=k;
        return;
    }
    void PushDown(int x){
        if (S[x].cov){
            Cover(ls,S[x].cov);Cover(rs,S[x].cov);
            S[x].cov=0;
        }
        if (S[x].pls){
            Plus(ls,S[x].pls);Plus(rs,S[x].pls);
            S[x].pls=0;
        }
        return;
    }
    ll Mx(int x,int l,int r,int ql,int qr){
        if (l==ql&&r==qr) return S[x].mx;
        PushDown(x);
        if (qr<=mid) return Mx(ls,l,mid,ql,qr);
        else if (ql>=mid+1) return Mx(rs,mid+1,r,ql,qr);
        else return max(Mx(ls,l,mid,ql,mid),Mx(rs,mid+1,r,mid+1,qr));
    }
    void SetSame(int x,int l,int r,int ql,int qr,ll key){
        if (l==ql&&r==qr){
            Cover(x,key);return;
        }
        PushDown(x);
        if (qr<=mid) SetSame(ls,l,mid,ql,qr,key);
        else if (ql>=mid+1) SetSame(rs,mid+1,r,ql,qr,key);
        else SetSame(ls,l,mid,ql,mid,key),SetSame(rs,mid+1,r,mid+1,qr,key);
        Update(x,l,r);return;
    }
    void RangePlus(int x,int l,int r,int ql,int qr,ll key){
        if (l==ql&&r==qr){
            Plus(x,key);return;
        }
        PushDown(x);
        if (qr<=mid) RangePlus(ls,l,mid,ql,qr,key);
        else if (ql>=mid+1) RangePlus(rs,mid+1,r,ql,qr,key);
        else RangePlus(ls,l,mid,ql,mid,key),RangePlus(rs,mid+1,r,mid+1,qr,key);
        Update(x,l,r);return;
    }
    void RangeQuery(int x,int l,int r,int ql,int qr){
        if (l==ql&&r==qr){
            S[x].tcnt=S[x].cnt;S[x].tmx=S[x].mx;
            return;
        }
        PushDown(x);
        if (qr<=mid){
            RangeQuery(ls,l,mid,ql,qr);
            S[x].tcnt=S[ls].tcnt;S[x].tmx=S[ls].tmx;
        }
        else if (ql>=mid+1){
            RangeQuery(rs,mid+1,r,ql,qr);
            S[x].tcnt=S[rs].tcnt;S[x].tmx=S[rs].tmx;
        }
        else{
            RangeQuery(ls,l,mid,ql,mid);RangeQuery(rs,mid+1,r,mid+1,qr);
            S[x].tmx=max(S[ls].tmx,S[rs].tmx);
            S[x].tcnt=S[ls].tcnt+Get(rs,mid+1,r,mid+1,qr,S[ls].tmx);
        }
        return;
    }
    int Query(int x,int l,int r){
        if (l>r) return 0;
        ll mx=Mx(1,1,n,x,l),keyx=Mx(1,1,n,x,x);
        if (mx==keyx){
            int ql=l,qr=r,pos=r+1;
            while (ql<=qr){
                int md=(ql+qr)>>1;
                if (Mx(1,1,n,l,md)>keyx) pos=md,qr=md-1;
                else ql=md+1;
            }
            int Ans=pos-l;
            if (pos<=r){
                RangeQuery(1,1,n,pos,r);
                Ans+=S[1].tcnt;
            }
            return Ans;
        }
        else{
            ll lft=Mx(1,1,n,l,l);
            SetSame(1,1,n,l,l,mx);
            RangeQuery(1,1,n,l,r);int Ans=S[1].tcnt-(lft<mx);
            SetSame(1,1,n,l,l,lft);
            return Ans;
        }
    }
};

int Q;
SegmentTree T1,T2;

int main(){
    int Case;scanf("%d",&Case);
    while (Case--){
        scanf("%d%d",&n,&Q);for (int i=1;i<=n;i++) scanf("%d",&Input[i]);
        T1.Build(1,1,n);reverse(&Input[1],&Input[n+1]);T2.Build(1,1,n);
        while (Q--){
            int opt,l,r,k;scanf("%d%d%d%d",&opt,&l,&r,&k);
            if (opt==1) T1.RangePlus(1,1,n,l,r,k),T2.RangePlus(1,1,n,n-r+1,n-l+1,k);
            if (opt==2) T1.SetSame(1,1,n,l,r,k),T2.SetSame(1,1,n,n-r+1,n-l+1,k);
            if (opt==3){
                if (k>=l&&k<=r) printf("%d\n",T1.Query(k,k+1,r)+T2.Query(n-k+1,n-(k-1)+1,n-l+1)+1);
                else if (k<l) printf("%d\n",T1.Query(k,l,r));
                else printf("%d\n",T2.Query(n-k+1,n-r+1,n-l+1));
            }
        }
    }
    return 0;
}
```