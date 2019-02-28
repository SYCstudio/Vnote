# [UER #7]套路
[UOJ246]

反攻正在进行中，按照套路，跳蚤国将会很快获得最终的胜利。跳蚤国的情报局也没闲下来，他们正打算派遣一批“菲克蚤”前往跳晚国窃取有关三星 note7 的资料。  
Fake Yang 是这批“菲克蚤”的教练，他教会他们各种 Fake 的技术，以便更好混入敌方内部。共 $n$ 只菲克蚤，由 $1$ 到 $n$ 编号。Fake Yang 给每个菲克蚤都算了特征值 $a_1, \dots, a_n$，两个菲克蚤的相似度定义成这两个菲克蚤的特征值的差的绝对值，即第 $i$ 只菲克蚤与第 $j$ 只菲克蚤的相似度为 $\lvert a_i - a_j \rvert$。  
现在这批菲克蚤排成一列在 Fake Yang 面前，Fake Yang 需要在其中选出一些菲克蚤合成一个行动小队。按照套路，他会选取连续一整段的菲克蚤 $a_l, a_{l + 1}, \dots, a_r$。很显然，这个行动小队越大越好，但是按照套路，小队内的跳蚤最好都各不相同，假如有两只跳蚤长得很像的话很可能会引起跳晚们的怀疑。为此 Fake Yang 将小队的相似度定义为小队中的跳蚤两两之间的最小的相似度，用 $s(l, r)$ 表示。  
为保证安全，现在他想选取至少 $k$ 只跳蚤，且使得安全值最大。其中安全值定义如下：

$$s(l, r) \times (r - l)$$

但是，他并不知道最优解是什么，于是按照套路你需要帮助他求得这个值。  

注意到一个性质，$s(l,r)(r-l) \le n$，考虑根号分治。  
对于大小小于根号的区间，设 F[l][r] 表示 l 到 r 的最小相似度，那么有 F[l][r]=min(F[l+1][r],F[l][r-1],abs(A[l]-A[r])) ，直接 DP 即可；对于大小超过根号的区间，此时相似度不会超过根号，从前往后枚举每一个位置，每次枚举这个位置上的数值前后 K 个值，维护一个 lst 数组标记答案区间。

```cpp
#include<cstdio>
#include<cstring>
#include<algorithm>
#include<cmath>
#include<iostream>
using namespace std;

typedef long long ll;
const int maxN=201000;

int n,m,K,Seq[maxN],lst[maxN],pos[maxN];
int Mn[2][maxN];
ll Ans=0;

int main(){
    scanf("%d%d%d",&n,&m,&K);int srt=sqrt(m)+1;
    for (int i=1;i<=n;i++) scanf("%d",&Seq[i]);
    int now=1;
    for (int i=1;i<n;i++){
        Mn[now][i]=abs(Seq[i]-Seq[i+1]);
        if (K==2) Ans=max(Ans,1ll*Mn[now][i]);
    }
    for (int b=3;b<=srt;b++){
        now^=1;
        for (int i=1;i+b-1<=n;i++){
            Mn[now][i]=min(min(Mn[now^1][i],Mn[now^1][i+1]),abs(Seq[i]-Seq[i+b-1]));
            if (b>=K) Ans=max(Ans,1ll*(b-1)*Mn[now][i]);
        }
    }

    for (int i=1;i<=n;i++){
        for (int j=0,mxpos=0;j<=srt;j++){
            if (Seq[i]-j>=1&&pos[Seq[i]-j]) lst[j]=max(lst[j],pos[Seq[i]-j]);
            if (Seq[i]+j<maxN&&pos[Seq[i]+j]) lst[j]=max(lst[j],pos[Seq[i]+j]);
            if (lst[j]>mxpos&&i-mxpos>=K) Ans=max(Ans,1ll*j*(i-mxpos-1));
            mxpos=max(mxpos,lst[j]);
        }
        pos[Seq[i]]=i;
    }
    printf("%lld\n",Ans);return 0;
}
```