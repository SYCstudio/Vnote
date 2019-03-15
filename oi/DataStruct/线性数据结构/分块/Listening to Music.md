# Listening to Music
[CF543E]

You really love to listen to music. During the each of next s days you will listen to exactly m songs from the playlist that consists of exactly n songs. Let's number the songs from the playlist with numbers from 1 to n, inclusive. The quality of song number i is ai.  
On the i-th day you choose some integer v (li ≤ v ≤ ri) and listen to songs number v, v + 1, ..., v + m - 1. On the i-th day listening to one song with quality less than qi increases your displeasure by exactly one.  
Determine what minimum displeasure you can get on each of the s next days.

直接的想法就是把数字从小到大加入，每次相当于是对一段区间进行加法操作，主席树存储下这个过程以支持在线询问。  
但是这题卡空间。考虑另外的做法。依然还是把数字从小a到大加入，但是考虑分块，设块大小为 $B=\sqrt{n}$ ，每块只在结尾记录一下信息。但是记录的也不能是全部的信息，考虑再对序列分一次块，每次记录的只能是每块的信息，这样总共需要记录的信息数就是 $O(\sqrt{B}^2)=O(n)$ 级别的了。  
考虑询问需要什么。对于一个询问，先考虑其权值 x ，对于小于 x 的整块，需要的信息是其前缀和，那么就预处理 Mn[i][j] 表示数字的前 i 块中第 j 块的答案，每次再把零散的部分加入进去。但是注意到这样，最坏情况需要加入 $B$ 个元素，每个元素涉及最多 $B$ 块和 $B$ 个零散的修改。中间 $B$ 块的修改可以用差分实现，但是旁边离散的不好处理。考虑在预处理的时候再预处理修改区间左右端点对应的最小值，这样就可以使得对于零散块的修改也降低到 $O(1)$ 级别。  
然后考虑查询。对于中间的整块，可以直接调用直接得到的答案。但是对于两边的块，暴力查找复杂度不对。所以另外还需要预处理每一块开头的答案，这样就可以在块内递推得到对应的值了。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
using namespace std;

#define RG register
const int maxN=402000;
const int maxB=510;
const int inf=2000000000;

int n,m,bcnt;
int Seq[maxN],Srt[maxN],B[maxN],Bl[maxN],Br[maxN];
int Label[maxN],Val[maxN];
int Lkey[maxB][maxB],Mn[maxB][maxB],Lmn[maxN],Rmn[maxN];
int Rgmn[maxN],Sm[maxN],Lft[maxN];
pair<int,int> Pr[maxN];

int Query(int l,int r,int x);
int main(){
    RG int i,j,l,r;
    scanf("%d%d",&n,&m);
    for (i=1;i<=n;++i) scanf("%d",&Seq[i]),Pr[i]=make_pair(Seq[i],i);
    sort(&Pr[1],&Pr[n+1]);
    for (i=1;i<=n;++i) Srt[i]=Pr[i].first;Srt[0]=-inf;

    int Block=sqrt(n);
    bcnt=(n-1)/Block+1;
    for (i=1;i<=n;++i){
        B[i]=(i-1)/Block+1;Br[B[i]]=i;
        if (!Bl[B[i]]) Bl[B[i]]=i;
    }

    for (i=1;i<=n;++i){
        l=max(Pr[i].second-m+1,1);r=Pr[i].second;
        if (B[l]==B[r]) for (j=l;j<=r;++j) ++Val[j];
        else{
            for (j=l;j<=Br[B[l]];++j) ++Val[j];
            for (j=Bl[B[r]];j<=r;++j) ++Val[j];
            for (j=B[l]+1;j<B[r];++j) ++Label[j];
        }
        Lmn[i]=inf;for (j=Bl[B[l]];j<=Br[B[l]];++j) Lmn[i]=min(Lmn[i],Val[j]);
        Rmn[i]=inf;for (j=Bl[B[r]];j<=Br[B[r]];++j) Rmn[i]=min(Rmn[i],Val[j]);
        if (B[i]!=B[i+1]){
            int b=B[i];
            for (j=1;j<=n;++j) Val[j]+=Label[B[j]];
            for (j=1;j<=bcnt;++j) Label[j]=0,Mn[b][j]=inf,Lkey[b][j]=Val[Bl[j]];
            for (j=1;j<=n;++j) Mn[b][B[j]]=min(Mn[b][B[j]],Val[j]);
        }
    }

    int Q,lstans=0;scanf("%d",&Q);
    while (Q--){
        int nx;scanf("%d%d%d",&l,&r,&nx);nx^=lstans;
        int cl=1,cr=n,p=0;
        while (cl<=cr){
            int mid=(cl+cr)>>1;
            if (Pr[mid].first<=nx-1) p=mid,cl=mid+1;
            else cr=mid-1;
        }
        if (p==0){
            printf("%d\n",lstans=0);continue;
        }
        int stb=B[p];
        for (i=1;i<=bcnt;++i) Sm[i]=0,Lft[i]=Lkey[stb-1][i],Rgmn[i]=Mn[stb-1][i];
        for (i=Bl[stb];i<=p;++i){
            int pl=max(Pr[i].second-m+1,1),pr=Pr[i].second;
            Rgmn[B[pl]]=Lmn[i];Rgmn[B[pr]]=Rmn[i];
            if (B[pl]<B[pr]) ++Sm[B[pl]+1],--Sm[B[pr]];
            if (pl<=Bl[B[l]]&&Bl[B[l]]<=pr) ++Lft[B[l]];
            if (pl<=Bl[B[r]]&&Bl[B[r]]<=pr&&B[l]!=B[r]) ++Lft[B[r]];
        }
        for (i=1;i<=bcnt;++i) Sm[i]+=Sm[i-1],Rgmn[i]+=Sm[i];
        if (B[l]==B[r]) lstans=Query(l,r,nx-1);
        else{
            lstans=min(Query(l,Br[B[l]],nx-1),Query(Bl[B[r]],r,nx-1));
            for (int i=B[l]+1;i<B[r];i++) lstans=min(lstans,Rgmn[i]);
        }
        printf("%d\n",lstans);
    }
    return 0;
}
int Query(int l,int r,int x){
    int val=Lft[B[l]];
    for (int i=Bl[B[l]]+1;i<=l;i++) val+=(Seq[i+m-1]<=x)-(Seq[i-1]<=x);
    int ret=val;
    for (int i=l+1;i<=r;i++) val+=(Seq[i+m-1]<=x)-(Seq[i-1]<=x),ret=min(ret,val);
    return ret;
}
```