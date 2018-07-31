# Tavas and Malekas
[CF535D]

Tavas is a strange creature. Usually "zzz" comes out of people's mouth while sleeping, but string s s s of length n n n comes out from Tavas' mouth instead.  
![CF535D](_v_images/_cf535d_1533036204_1679189490.png)

Today Tavas fell asleep in Malekas' place. While he was sleeping, Malekas did a little process on s. Malekas has a favorite string p. He determined all positions x1 < x2 < ... < xk where p matches s. More formally, for each xi (1 ≤ i ≤ k) he condition sxisxi + 1... sxi + |p| - 1 = p is fullfilled.   
Then Malekas wrote down one of subsequences of x1, x2, ... xk (possibly, he didn't write anything) on a piece of paper. Here a sequence b is a subsequence of sequence a if and only if we can turn a into b by removing some of its elements (maybe no one of them or all).  
After Tavas woke up, Malekas told him everything. He couldn't remember string s, but he knew that both p and s only contains lowercase English letters and also he had the subsequence he had written on that piece of paper.  
Tavas wonders, what is the number of possible values of s? He asked SaDDas, but he wasn't smart enough to solve this. So, Tavas asked you to calculate this number for him.  
Answer can be very large, so Tavas wants you to print the answer modulo 109 + 7.

给出一个串，已知这个串在另一个串中出现的所有位置的一个子序列，和这个串的长度，求合法的另一个串的方案数。

合法判断即两个相邻出现位置如果相距小于模式串长度，则要求必须是一个模式串的一个公共前后缀的补，那么用这个判定是否可行。然后把确定的位置覆盖，剩下任意填的求方案。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010000;
const int Mod=1e9+7;
const int inf=2147483647;

int n,m,q;
int qcnt,Seq[maxN];
char str[maxN];
int Next[maxN];
bool mark[maxN];

int main()
{
    scanf("%d%d",&n,&q);
    scanf("%s",str+1);m=strlen(str+1);
    for (int i=1;i<=q;i++) scanf("%d",&Seq[i]);

    Next[0]=Next[1]=0;
    for (int i=2;i<=m;i++){
        int j=Next[i-1];
        while ((j!=0)&&(str[j+1]!=str[i])) j=Next[j];
        if (str[j+1]==str[i]) j++;Next[i]=j;
    }

    mark[m]=1;
    for (int i=m;i;i=Next[i]) mark[m-i]=1;

    bool flag=1;
    for (int i=2;i<=q;i++)
        if ((Seq[i]-Seq[i-1]<=m)&&(mark[Seq[i]-Seq[i-1]]==0)){
            flag=0;break;
        }
    if (flag==0){
        printf("0\n");return 0;
    }

    ll empty=n;
    for (int i=2;i<=q;i++) empty-=min(m,Seq[i]-Seq[i-1]);
    if (q!=0) empty-=m;

    ll ans=1;
    while (empty--) ans=1ll*ans*26%Mod;
    printf("%lld\n",ans);
    return 0;
}
```