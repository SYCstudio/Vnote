# Codeforces Round #500 (Div. 1) \[based on EJOI] (VP)
[link](http://codeforces.com/contest/1012)

## C.Hills

给定一行 $n$ 个整数表示高度，定义山峰为严格大于两边的高度（如果存在）的点。可以花费 1 的代价使得某一点高度 -1 ，对于每一个 $i \in [1,\lceil \frac{n}{2} \rceil]$ ，求出能选出 $i$ 座山的最小代价。

设 $F[i][j][0/1]$ 表示前 i 个高度选出 j 个山峰，第 $i$ 个是否为山峰的最小代价。 F[i][j][0] 可以从 F[i-1][j][0] 和 F[i-1][j][1] 转移过来， F[i][j][1] 可以从 F[i-2][j-1][0] 和 F[i-2][j-1][1] 转移过来，分别讨论一下。

```cpp
#include<bits/stdc++.h>
using namespace std;

const int maxN=5010;

int n,A[maxN];
int F[maxN][maxN/2][2];

int main(){
    scanf("%d",&n);for (int i=1;i<=n;i++) scanf("%d",&A[i]);
    memset(F,127,sizeof(F));
    F[0][0][0]=F[0][0][1]=0;
    for (int i=1;i<=n;i++){
        for (int j=0,limit=i/2+(i&1);j<=limit;j++){
            F[i][j][0]=min(F[i-1][j][0],F[i-1][j][1]+max(0,A[i]-A[i-1]+1));
            if (j){
                if (i==1) F[i][j][1]=0;
                else if (i==2) F[i][j][1]=F[i-1][j-1][0]+max(0,A[i-1]-A[i]+1);
                else F[i][j][1]=min(F[i-2][j-1][1]+max(0,max(A[i-1]-A[i-2]+1,A[i-1]-A[i]+1)),F[i-2][j-1][0]+max(0,A[i-1]-A[i]+1));
            }
        }
    }
    for (int i=1,limit=n/2+(n&1);i<=limit;i++) printf("%d ",min(F[n][i][0],F[n][i][1]));printf("\n");
    return 0;
}
```

## D.AB-Strings

给定两个仅包含 a,b 字符的字符串，每次可以交换两段前缀（前缀可以为空），求最少的操作次数使得两个串分别仅出现 a 和 b ，并给出一种构造方案。

不难发现连续的相同字符可以一起操作，那么输入进来后就压缩成 abab 或者 baba 的形式。考虑一般情况，一次好的交换可以消除两个字符，两个字符串各一个，并且这是每一次操作的上界；但当其中一个字符串长度为 1 时，操作一次并不能达到这个上界，所以在开始的时候就进行调整，把两个字符串补齐。

```cpp
#include<bits/stdc++.h>
using namespace std;

const int maxN=505000;

char In[maxN];
vector<pair<int,int> > A,B,Ans;

void Init(char *S,vector<pair<int,int> > &V);
void PushBack(vector<pair<int,int> > &V,pair<int,int> p);
void Exge(int l);
int main(){
    scanf("%s",In+1);Init(In,A);scanf("%s",In+1);Init(In,B);
    int swp=0;if (A.size()>B.size()) swap(A,B),swp=1;

    if (A.back().first==B.back().first){
        if ((B.size()-A.size())%4==3) Exge((B.size()-A.size()+1)/4*2);
        int l=(B.size()-A.size())/4*2+1;A.push_back(make_pair(B[B.size()-l-1].first,0));
        Exge(l);
    }
    else if (B.size()-A.size()>2) Exge((B.size()-A.size()+1)/4*2+1);

    while (A.size()>1||B.size()>1) Exge(1);
    printf("%d\n",(int)Ans.size());
    for (int i=0,sz=Ans.size();i<sz;i++)
        swp?printf("%d %d\n",Ans[i].second,Ans[i].first):printf("%d %d\n",Ans[i].first,Ans[i].second);
    return 0;
}
void Init(char *S,vector<pair<int,int> > &V){
    for (int i=strlen(S+1);i>=1;i--) PushBack(V,make_pair(S[i],1));return;
}
void PushBack(vector<pair<int,int> > &V,pair<int,int> p){
    if (V.empty()||V.back().first!=p.first) V.push_back(p);else V.back().second+=p.second;
    return;
}
void Exge(int l){
    int tl=0;pair<int,int> la=A.back();A.pop_back();
    for (int i=l,bsz=B.size();i>=1;i--) PushBack(A,B[bsz-i]),tl+=B[bsz-i].second;
    Ans.push_back(make_pair(la.second,tl));
    for (int i=1;i<=l;i++) B.pop_back();PushBack(B,la);
    return;
}
```

## E.Cycle sort

给定一个长度为 $n$ 的序列 $A$，现在可以进行若干次操作，每次操作指定一个长度小于等于 $n$ 的任意无重序列 $B$ ，把序列 $A$ 做 $B$ 的置换，即 $A _ {B _ i} \Rightarrow A _ {B _ {i+1}}$ 。要求最后使得序列 $A$ 不降。另外给定参数 $S$ ，要求所有操作序列 $B$ 的长度之和不能超过 $S$ ，在此基础上构造一组操作次数最少的方案。

先考虑没有 $S$ 的排列怎么做。一个排列必然可以拆分成若干环，这些环中大小超过 $1$ 的都是必须至少移动一次的，这些数的个数也是操作总数量的下界；当没有 $S$ 的限制时，若只有一个这样的环，自然只要操作一次；否则，存在一种只需操作两次的构造方法，即把这些环分别断开再首尾相连，此为第一次操作，再倒序把所有接口再进行一次置换，此为第二次操作。  
考虑把上述做法推广到序列上。先排序，若排序后某位置上的数与排序前相同，那么这个数就不需要动了，剩下的数按照排列一样做。  
最后来考虑 $S$ 的限制。首先，直接把所有环单独做置换的总需要操作次数是环长之和，并且此为操作下界，若 $S$ 仍小于该下界，则一定无解。否则，若把 $K$ 个环合在一起做上述两次的构造方法，则需要 $K$ 的操作空间。想要最优化问题，首先要优化环的数量。对于权值相同但不在一个环内的数字，可以交换两个指向以合并这两个环。这个操作可以用并查集来维护。这样就可以最小化环的数量了，剩下的部分则选择尽量多的环加入特殊构造，其余的直接构造。

```cpp
#include<bits/stdc++.h>
using namespace std;

const int maxN=202000;

int n,S,ufs[maxN],Id[maxN],vis[maxN];
pair<int,int> A[maxN];
vector<int> Ring[maxN];

int find(int x);
void dfs(int rcnt,int u);
int main(){
    scanf("%d%d",&n,&S);for (int i=1;i<=n;i++) scanf("%d",&A[i].first),A[i].second=ufs[i]=i;
    sort(&A[1],&A[n+1]);for (int i=1;i<=n;i++) Id[A[i].second]=i;
    for (int i=1;i<=n;i++)
        if (A[i].first==A[Id[i]].first&&i!=Id[i]){
            int x=A[i].second,y=Id[i];
            A[y].second=x;Id[x]=y;Id[i]=A[i].second=i;
        }
    int sum=0,rcnt=0;
    for (int i=1;i<=n;i++) ufs[find(i)]=find(Id[i]);
    for (int i=1,lst=0;i<=n;i++)
        if (Id[i]!=i){
            ++sum;
            if (lst&&A[lst].first==A[i].first&&find(A[lst].second)!=find(A[i].second)){
                ufs[find(A[lst].second)]=find(A[i].second);swap(Id[A[lst].second],Id[A[i].second]);
            }
            lst=i;
        }
    for (int i=1;i<=n;i++) if (Id[i]!=i&&!vis[i]) dfs(++rcnt,i);

    if (sum>S){
        puts("-1");return 0;
    }
    int trn=min(S-sum,rcnt);
    if (trn<=2){
        printf("%d\n",rcnt);
        for (int i=1,sz;i<=rcnt;i++){
            printf("%d\n",sz=Ring[i].size());for (int j=0;j<sz;j++) printf("%d ",Ring[i][j]);printf("\n");
        }
    }
    else{
        printf("%d\n",rcnt-(trn-2));
        for (int i=1,sz;i<=rcnt-trn;i++){
            printf("%d\n",sz=Ring[i].size());for (int j=0;j<sz;j++) printf("%d ",Ring[i][j]);printf("\n");
        }
        int sum=0;for (int i=rcnt-trn+1;i<=rcnt;i++) sum+=Ring[i].size();
        printf("%d\n",sum);
        for (int i=rcnt-trn+1;i<=rcnt;i++) for (int j=0,sz=Ring[i].size();j<sz;j++) printf("%d ",Ring[i][j]);printf("\n");
        printf("%d\n",trn);
        for (int i=rcnt;i>=rcnt-trn+1;i--) printf("%d ",Ring[i][0]);printf("\n");
    }
    return 0;
}
int find(int x){
    if (ufs[x]!=x) ufs[x]=find(ufs[x]);
    return ufs[x];
}
void dfs(int rcnt,int u){
    if (vis[u]) return;
    Ring[rcnt].push_back(u);vis[u]=1;
    dfs(rcnt,Id[u]);return;
}
```

## F.Passports

给定 $n$ 个国家，现在每一个国家都举办了一个活动，活动有开始时间 $s _ i$ 和持续时长 $t _ i$ ，活动从 $s _ i$ 的早上开始举办，持续到 $s _ i+t _ i-1$ 的晚上。参加某个国家的活动需要办理这个国家的签证，国家 $i$ 的需要的办理时间是 $l _ i$ ，并且签证的办理和结束都在中午。初始的时候你在一个不属于这 $n$ 个国家中任意一个的城市 $X$ ，所有的签证都必须在城市 $X$ 办理，但签证提交上去后可以不在城市 $X$ ，签证办理结束后会自动邮寄给你（不管在那个国家）。现在你有 $P$ 本护照，求是否存在一种方案使得你能够参加所有国家的活动。

设 $F[S]$ 表示使用一本护照将集合 S 中的所有签证都办理完的最早时间。枚举一个不在 $S$ 中的签证 $i$ ，设这个签证开始的时间为 $d$ ，那么要求对于在 $S$ 集合中的 $j$，若 $s _ j \le d+l _ i$ 则要求 $d \ge s _ j+t _ j$ ，而对于不在 $S$ 集合中的 $j$ ，则要求 $d$ 不能在区间 $[s _ j,s _ j+t _ j)$ 范围内。提前将所有活动分别按照 $s$ 和 $l$ 排两个序，就可以做到复杂度 $O(2 ^ nn)$ 。  
对于 $P=1$ 的情况，若全集有解则有解。对于 $P=2$ 的情况，枚举将全集拆分成两个不相交的集合 $A,B$ ，若 $A,B$ 有解，则有解。

```cpp
#include<bits/stdc++.h>
using namespace std;

#define pw(x) (1<<(x))
const int maxN=22;
const int inf=2000000000;

int n,P;
int Srt[maxN],Len[maxN],Nt[maxN];
int Is[maxN],It[maxN];
int F[pw(maxN)+10],From[pw(maxN)+10];
pair<int,int> Ans[maxN];

bool cmps(int a,int b);
bool cmpt(int a,int b);
int main(){
    scanf("%d%d",&n,&P);int N=1<<n;for (int i=1;i<N;i++) F[i]=inf;
    F[0]=1;
    for (int i=0;i<n;i++) scanf("%d%d%d",&Srt[i],&Len[i],&Nt[i]),Is[i]=It[i]=i;
    sort(&Is[0],&Is[n],cmps);sort(&It[0],&It[n],cmpt);
    for (int S=0;S<N;S++){
        if (F[S]==inf) continue;
        int lip=0,limt=F[S],above=0;
        for (int i=0;i<n;i++)
            if (!(S&pw(It[i]))){
                while (lip<n&&limt+Nt[It[i]]>=Srt[Is[lip]]){
                    if (!(S&pw(Is[lip]))) if (limt>=Srt[Is[lip]]&&limt<Srt[Is[lip]]+Len[Is[lip]]) limt=Srt[Is[lip]]+Len[Is[lip]];else;
                    else limt=max(limt,Srt[Is[lip]]+Len[Is[lip]]);
                    above|=pw(Is[lip]);++lip;
                }
                if ((above&pw(It[i]))||(limt+Nt[It[i]]>=Srt[It[i]])) continue;
                if (F[S|pw(It[i])]>limt+Nt[It[i]]) F[S|pw(It[i])]=limt+Nt[It[i]],From[S|pw(It[i])]=It[i];
            }
    }
    if (P==1){
        if (F[N-1]==inf) puts("NO");
        else{
            int S=N-1;while (S) Ans[From[S]].second=F[S]-Nt[From[S]],S^=pw(From[S]);
            puts("YES");
            for (int i=0;i<n;i++) printf("1 %d\n",Ans[i].second);
        }
    }
    else{
        for (int S=0;S<N;S++)
            if (F[S]!=inf&&F[S^(N-1)]!=inf){
                int T=S;while (T) Ans[From[T]]=make_pair(1,F[T]-Nt[From[T]]),T^=pw(From[T]);
                T=S^(N-1);while (T) Ans[From[T]]=make_pair(2,F[T]-Nt[From[T]]),T^=pw(From[T]);
                puts("YES");
                for (int i=0;i<n;i++) printf("%d %d\n",Ans[i].first,Ans[i].second);
                return 0;
            }
        puts("NO");
    }
    return 0;
}
bool cmps(int a,int b){
    return Srt[a]<Srt[b];
}
bool cmpt(int a,int b){
    return Nt[a]<Nt[b];
}
```