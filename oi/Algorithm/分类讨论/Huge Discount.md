# Huge Discount
[CFGym101981H]

John heard an urban legend from Dreamoon about convenience stores in Incredible Convenient Purchasing Country (ICPC). The original price of any good there is usually as high as 10105 . Of course, nobody is going to pay such a high price. Instead, one can remove any two consecutive distinct digits from the original price. One can perform such operation as many times as he wants. Needless to say, each removal must be valid.  
For example, if the original price is 123, one could pay 1 dollar by removing 23 or pay 3 dollars by removing 12. However, it’s illegal to pay 2 dollars because 1 and 3 are not adjacent. However, if the original price is 111, no removal can be performed as all digits are the same.  
There may be leading zeroes on the price tag. Also, leading zeroes may occur after some of such removals. In these cases, the leading zeroes are not removed automatically. Therefore, if the price tag reads 0033, one can get it for free by removing 03 twice. John found some of such convenience stores. In these particular stores, there are some interesting properties on the prices:  
1. Only digits 0, 1 and 2 are used.  
2. For every i, if the first digit on the price tag of good i is removed, it becomes the price tag if good i + 1. For example, if the price tag of good 1 is 012, the price tag of good 2 is 12 and the price tag of good 3 is 2.  
Please tell John how much it costs to buy all goods in one particular store.

首先，若区间内某种数的个数超过一半，那么这个串的答案自然就是以这个数组成的，长度为这个串出现次数减其它两个数出现个数的串。否则，若区间长度为偶数，说明可以全部消掉。第三种情况则是区间长度为奇数且不存在某个数出现超过一半，对于这种情况，暴力的想法即枚举最后剩的是哪个位置上的数，看两边能否都消除掉。以前缀和的形式表示，即 $C[j-1][0/1/2]\le\frac{j}{2}$ 且 $C[i][0/1/2]-C[j][0/1/2] \le \frac{i-j}{2}$ ，前一个只与  j 有关，在处理的时候只把合法的放入考虑；后一个则是一个三位偏序的关系，但注意到题目的性质保证了三个最多只会有一个违反，所以可以简单地统计违反的数量判断是否存在合法解。用树状数组即可维护。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

const int maxN=101000;
const int maxNum=1010000;
int n;
class BIT{
    public:
    int B[maxN+maxN],sum;
    void Insert(int x){
        ++sum;x+=maxN;
        while (x<maxN+maxN){
            ++B[x];x+=(x)&(-x);
        }
        return;
    }
    int Sum(int x){
        int ret=0;x+=maxN;
        while (x){
            ret+=B[x];x-=(x)&(-x);
        }
        return ret;
    }
    int Morethan(int x){
        return sum-Sum(x);
    }
};
int C[maxN][3],Seq[maxNum];
char Input[maxN];
BIT B[3][3];

int main(){
    scanf("%d",&n);scanf("%s",Input+1);reverse(&Input[1],&Input[n+1]);
    for (int i=1;i<=n;i++){
        int c=Input[i]-'0';
        C[i][0]=C[i-1][0];C[i][1]=C[i-1][1];C[i][2]=C[i-1][2];++C[i][c];
        if (2*C[i-1][0]<=i-1&&2*C[i-1][1]<=i-1&&2*C[i-1][2]<=i-1&&(i&1)){
            B[c][0].Insert(i-2*C[i][0]);B[c][1].Insert(i-2*C[i][1]);B[c][2].Insert(i-2*C[i][2]);
        }
        if (C[i][0]*2>i||C[i][1]*2>i||C[i][2]*2>i){
            if (C[i][1]*2>i) ++Seq[0],--Seq[C[i][1]-C[i][0]-C[i][2]];
            else if (C[i][2]*2>i) Seq[0]+=2,Seq[C[i][2]-C[i][0]-C[i][1]]-=2;
        }
        else if (i&1){
            for (int b=0;b<=2;b++)
                if (B[b][0].Morethan(i-2*C[i][0])+B[b][1].Morethan(i-2*C[i][1])+B[b][2].Morethan(i-2*C[i][2])<B[b][0].sum){
                    Seq[0]+=b;Seq[1]-=b;break;
                }
        }
    }
    for (int i=1;i<maxNum;i++) Seq[i]+=Seq[i-1];
    for (int i=0;i+1<maxNum;i++) Seq[i+1]+=Seq[i]/10,Seq[i]%=10;
    int up=maxNum-1;
    while (up&&!Seq[up]) --up;
    for (int i=up;i>=0;i--) printf("%d",Seq[i]);
    printf("\n");return 0;
}
```